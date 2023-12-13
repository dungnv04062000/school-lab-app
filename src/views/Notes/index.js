import React, { useEffect, useState } from "react";
import "./list-note-student.scss";
import TableStudentListNote from "../../components/common/table/table-student/table-listNote";
import LayoutHomeList from "../../components/layouts/mainLayout";
import BaseAPI from "../../util/BaseAPI";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import AppDrawer from "../../components/common/drawer";
import * as SC from "../../components/common/CustomButton/styled";
import FormNoteStudent from "../../components/common/form/form-note";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function ListNoteStudent() {
  const [notes, setNotes] = useState([]);
  const [currentNotePage, setCurrentNotePage] = useState(1);
  const [totalNoteItems, setTotalNoteItems] = useState(0);

  const [orderBy, setOrderBy] = useState("DESC");
  const [lessonSearchTitle, setLessonSearchTitle] = useState(null);
  const [noteSearchFrom, setNoteSearchFrom] = useState(null);
  const [noteSearchTo, setNoteSearchTo] = useState(null);

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleNotePageChange = (value) => {
    setCurrentNotePage(value);
  };

  useEffect(() => {
    getNotes();
  }, [currentNotePage]);

  const getNotes = () => {
    const response = BaseAPI.get("/notes", {
      params: {
        order_by: orderBy,
        page: currentNotePage,
        lesson_title: lessonSearchTitle?.trim()?.length > 0 ? lessonSearchTitle?.trim() : null,
        create_at_from: noteSearchFrom,
        create_at_to: noteSearchTo
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setNotes(res.data.items);
          setTotalNoteItems(res.data.total_items);
        }
      })
      .catch((err) => {
        setNotes([]);
        setTotalNoteItems(0);
      });
  };

  const handleOrderByChange = (value) => {
    setOrderBy(value);
  };

  const handleTitleSearchChange = (e) => {
    setLessonSearchTitle(e.target.value);
  };

  const handleCreateAtSearchChange = (value) => {
    let createAtFrom = null;
    let createAtTo = null;
    try {
      createAtFrom = value[0].unix() || null;
    } catch (error) {}
    try {
      createAtTo = value[1].unix() || null;
    } catch (error) {}

    setNoteSearchFrom(createAtFrom);
    setNoteSearchTo(createAtTo);
  };

  document.title = "Ghi chú";
  return (
    <LayoutHomeList
      content={
        <div className="list-note-student">
          <h1>Ghi chú</h1>
          <div className="filter-listNote">
            <Form onFinish={getNotes}>
              <Row gutter={[10, 0]} justify="start" align="middle">
                <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                  <label>Dự án</label>
                  <Form.Item>
                    <Input size="large" onChange={handleTitleSearchChange} />
                  </Form.Item>
                </Col>
                <Col xl={6} lg={6} md={6} sm={10} xs={24}>
                  <label>Ngày tạo</label>
                  <Form.Item>
                    <RangePicker format="DD-MM-yyyy" size="large" onChange={handleCreateAtSearchChange} />
                  </Form.Item>
                </Col>
                <Col xl={2} lg={4} md={6} sm={6} xs={10}>
                  <label>Sắp xếp theo</label>
                  <Form.Item>
                    <Select defaultValue={"DESC"} size="large" onChange={handleOrderByChange}>
                      <Option value="ASC">Cũ nhất</Option>
                      <Option value="DESC">Mới nhất</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <SC.btnWhite>Tìm kiếm</SC.btnWhite>
                </Col>
                <Col>
                  <SC.btnBlue onClick={showDrawer}>Tạo ghi chú</SC.btnBlue>
                  <AppDrawer
                    onClose={onClose}
                    open={open}
                    content={
                      <>
                        <FormNoteStudent refresh={getNotes} onClose={onClose} />
                      </>
                    }
                  />
                </Col>
              </Row>
            </Form>
          </div>
          <TableStudentListNote
            notes={notes}
            refresh={getNotes}
            totalItems={totalNoteItems}
            currentPage={currentNotePage}
            onPageChange={handleNotePageChange}
          />
        </div>
      }
    />
  );
}
