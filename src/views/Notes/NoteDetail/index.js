import { Affix, Breadcrumb, Button, Col, Divider, Empty, Form, Input, message, Modal, Row, Typography } from "antd";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import BaseAPI from "../../../util/BaseAPI";
import "./style.scss";
import * as SC from "../../../components/common/CustomButton/styled";
import Experiment from "./Experiment";
import { ReloadOutlined } from "@ant-design/icons";
import CreateExperiment from "./CreateExperiment";
import Loading from "../../../components/common/loading";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../../redux/selector";

const { Title } = Typography;

function NoteDetail() {
  const queryString = useLocation().search;
  const noteId = new URLSearchParams(queryString).get("noteId");

  const [note, setNote] = useState(null);
  const [saveNoteLoading, setSaveNoteLoading] = useState(false);

  const [openCreateExperiment, setOpenCreate] = useState(false);

  const [form] = useForm();

  const contentRef = useRef();

  useEffect(() => {
    getNote();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      content: note?.content
    });
  }, [note]);

  const getNote = () => {
    let response = BaseAPI.get(`/notes/${noteId}`);

    response
      .then((res) => {
        if (res?.status === 200) {
          setNote(res.data.item);
        } else {
          setNote(null);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const handleSaveNote = () => {
    setSaveNoteLoading(true);
    let response = BaseAPI.patch(`/notes/${noteId}`, {
      content: contentRef.current.resizableTextArea.textArea.value.trim()
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Cập nhật thành công");
          getNote();
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
        setSaveNoteLoading(false);
      })
      .catch((err) => {
        setSaveNoteLoading(false);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const showCreateExperimentDrawer = () => {
    setOpenCreate(true);
  };
  const closeDrawer = () => {
    setOpenCreate(false);
  };

  const navigate = useNavigate();

  const userInfo = useSelector(userInfoSelector);
  const lessonLink = `/${userInfo?.roles?.includes("STUDENT") ? "student" : "teacher"}/lessons/detail?lessonId=${
    note?.lesson_id
  }`;

  document.title = "Ghi chú - Nhật ký";
  return (
    <LayoutHomeList
      content={
        <div className="note-wrapper">
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigate(`/notes`)}>Danh sách ghi chú</Breadcrumb.Item>
            {note?.lesson_id && (
              <Breadcrumb.Item>
                <Link to={lessonLink}>{note?.title}</Link>
              </Breadcrumb.Item>
            )}
          </Breadcrumb>
          <Divider orientation="left">
            <Title level={3}>Ghi chú</Title>
          </Divider>
          <Form form={form} onFinish={handleSaveNote}>
            <Col>
              <label>Nội dung</label>
              <Form.Item name={"content"}>
                <TextArea rows={5} ref={contentRef} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>{saveNoteLoading ? <Loading /> : <SC.btnBlue type="submit">Lưu</SC.btnBlue>}</Form.Item>
            </Col>
          </Form>
          <Divider orientation="left">
            <Title level={3}>Nhật ký thí nghiệm</Title>
          </Divider>

          <Row gutter={[10, 10]} justify="start">
            <Affix offsetTop={10}>
              <Col>
                <SC.btnWhite onClick={getNote}>
                  <ReloadOutlined />
                </SC.btnWhite>
              </Col>
            </Affix>
            <Col>
              <SC.btnBlue onClick={showCreateExperimentDrawer}>Tạo thí nghiệm</SC.btnBlue>
            </Col>
            <CreateExperiment open={openCreateExperiment} onClose={closeDrawer} note={note} refresh={getNote} />
          </Row>
          <Title level={4} style={{ margin: "30px 0" }}>
            Danh sách thí nghiệm
          </Title>

          {note?.experiments && note?.experiments?.length > 0 ? (
            note.experiments.map((item) => {
              return <Experiment key={item?.id} isOwner note={note} experiment={item} refresh={getNote} />;
            })
          ) : (
            <Empty />
          )}
        </div>
      }
    />
  );
}

export default NoteDetail;
