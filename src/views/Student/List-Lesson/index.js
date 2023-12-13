import { Col, DatePicker, Form, Input, Row, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import "./lesson-student.scss";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import TableStudentListLesson from "../../../components/common/table/table-student/table-listLesson";
import { useLocation } from "react-router-dom";
import BaseAPI from "../../../util/BaseAPI";
import * as SC from "../../../components/common/CustomButton/styled";
import { useSelector } from "react-redux";
import { semestersSelector } from "../../../redux/selector";
import AppLineChart from "../../../components/common/Chart/LineChart";
import OwnerGradeStatistic from "./OwnerGradeStatistic";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function StudentListLesson() {
  const queryString = useLocation().search;
  const subjectId = new URLSearchParams(queryString).get("subjectId");

  const [subject, setSubject] = useState({});

  const semesters = useSelector(semestersSelector);
  const [semesterId, setSemesterId] = useState(semesters[0]?.id || undefined);

  const [lessons, setLessons] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [title, setTitle] = useState(null);
  const [level, setLevel] = useState(0);
  const [createAtFrom, setCreateAtFrom] = useState(null);
  const [createAtTo, setCreateAtTo] = useState(null);

  const handleTitleSearchChange = (e) => {
    setTitle(e.target.value.trim());
  };

  const handleCreateAtSearchChange = (value) => {
    try {
      setCreateAtFrom(value[0].unix());
    } catch (error) {
      setCreateAtFrom(null);
    }
    try {
      setCreateAtTo(value[1].unix());
    } catch (error) {
      setCreateAtTo(null);
    }
  };

  const handleSemesterChange = (value) => {
    setSemesterId(value);
  };

  const handleLevelSearchChange = (value) => {
    setLevel(value);
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  useEffect(() => {
    let response = BaseAPI.get(`/subjects/${subjectId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setSubject(res.data.item);
        } else {
          setSubject(null);
        }
      })
      .catch((err) => {
        setSubject(null);
      });
  }, []);

  useEffect(() => {
    if (semesterId) {
      getLessons();
    }
  }, [page, semesterId]);

  const getLessons = () => {
    let response = BaseAPI.get(`/student-lessons`, {
      params: {
        semester_id: semesterId,
        subject_id: subjectId,
        title: title ? title : null,
        level_id: level === 0 ? null : level,
        create_at_from: createAtFrom,
        create_at_to: createAtTo,
        page: page
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setLessons(res.data.items);
          setTotalItems(res.data.total_items);
        }
      })
      .catch((err) => {
        setLessons([]);
      });
  };

  document.title = `Môn ${subject.name} | Danh sách dự án`;
  return (
    <LayoutHomeList
      content={
        <div className="list-lesson-student">
          <Title level={3}>
            <span style={{ marginRight: 10 }}>Môn:</span>
            {subject.name}
          </Title>
          <div className="filter-listLab">
            <Form onFinish={getLessons}>
              <Row gutter={[10, 10]} justify="start" align="bottom">
                <Col xxl={3} xl={5} lg={5} md={12} sm={12} xs={24}>
                  <Form.Item>
                    <label>Học kỳ</label>
                    <Select
                      defaultValue={semesterId}
                      size="large"
                      onChange={handleSemesterChange}
                      placeholder="Chọn học kỳ"
                    >
                      {semesters.map((item) => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name} - {item.year}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={7} lg={7} md={12} sm={12} xs={24}>
                  <Form.Item>
                    <label>Dự án</label>
                    <Input size="large" onChange={handleTitleSearchChange} />
                  </Form.Item>
                </Col>
                <Col xl={6} lg={8} md={12} sm={12} xs={24}>
                  <Form.Item>
                    <label>Ngày tạo</label>
                    <RangePicker size="large" format="DD-MM-yyyy" onChange={handleCreateAtSearchChange} />
                  </Form.Item>
                </Col>
                <Col xl={3} lg={3} md={5} sm={6} xs={24}>
                  <Form.Item>
                    <label>Mức độ</label>
                    <Select defaultValue={0} size="large" onChange={handleLevelSearchChange}>
                      <Option value={0}>Tất cả</Option>
                      <Option value={1}>Đơn giản</Option>
                      <Option value={2}>Trung bình</Option>
                      <Option value={3}>Phức tạp</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <SC.btnWhite>Tìm kiếm</SC.btnWhite>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Row>
            <Col xxl={18} xl={24} lg={24} md={24}>
              <TableStudentListLesson
                lessons={lessons}
                totalItems={totalItems}
                currentPage={page}
                onPageChange={handlePageChange}
              />
            </Col>
            <Col xxl={6} xl={24} lg={24} md={24}>
              <OwnerGradeStatistic semesterId={semesterId} subjectId={subjectId} />
            </Col>
          </Row>
        </div>
      }
    />
  );
}
