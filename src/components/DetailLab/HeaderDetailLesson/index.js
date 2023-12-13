import { Col, Row, Statistic, message, Typography, Form, DatePicker, Popconfirm, Input, Select } from "antd";
import React, { useState } from "react";
import "./header-detail-lesson.scss";
import * as SC from "../../common/CustomButton/styled";
import AppDrawer from "../../common/drawer";
import * as TimeUtil from "../../../util/TimeUtil";
import BaseAPI from "../../../util/BaseAPI";
import { Link, useNavigate } from "react-router-dom";
import FormViewNote from "../../common/form/form-view-note";
import CopyLesson from "./CopyLessonToClass";
import moment from "moment";

const { Countdown } = Statistic;
const { Title } = Typography;
const { Option } = Select;

export default function HeaderDetailLesson({ note, lesson, teacher }) {
  const [openNote, setOpenNote] = useState(false);
  const [reOpen, setReOpen] = useState(false);
  const [endAt, setEndAt] = useState(null);

  const handleFinishClick = () => {
    const response = BaseAPI.patch(`/lessons/finish/${lesson.id}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Kết thúc dự án thành công");
          navigate(`/teacher/classes/lessons?classId=${lesson?.class_id}`);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const navigate = useNavigate();

  const handleReOpenClick = () => {
    const response = BaseAPI.patch(`/lessons/re-open/${lesson.id}`, {
      end_at: endAt
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Mở lại dự án thành công");
          navigate(-1);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const handleEndAtChange = (value) => {
    setEndAt(value?.unix() || null);
  };

  const showReOpen = () => {
    setReOpen(true);
  };

  const onCloseReOpen = () => {
    setReOpen(false);
  };

  const showDrawerNote = () => {
    setOpenNote(true);
  };

  const onCloseNote = () => {
    setOpenNote(false);
  };
  const onFinish = () => {
    message.info("Đã hết hạn nộp bài");
  };

  const deadline = moment.unix(lesson?.end_at); // Moment is also OK

  const [openCopyLessonDrawer, setOpenCopyLessonDrawer] = useState(false);
  const onShowCopyLessonDrawer = () => {
    setOpenCopyLessonDrawer(true);
  };
  const onCloseCopyLessonDrawer = () => {
    setOpenCopyLessonDrawer(false);
  };

  return (
    <div className="header-detail-lesson">
      <Row justify="space-between">
        <Col>
          <Title level={2}>{lesson.title}</Title>
        </Col>
        <Col style={{ fontStyle: "italic", textAlign: "center" }}>
          <span
            style={{
              fontWeight: 550,
              color: lesson.level_id === 1 ? "green" : lesson.level_id === 2 ? "orange" : "red"
            }}
          >
            {lesson.level_name}
          </span>
          <h3>{TimeUtil.convertUTCtoDatetime(lesson?.create_at)}</h3>
        </Col>
      </Row>
      <Row justify="space-between">
        <Col>
          <Row align="middle">
            {lesson.end_at && lesson.status === "ONGOING" ? (
              <>
                <Col style={{ marginRight: 15 }}>
                  <h3 style={{ marginBottom: "0" }}>Hạn nộp bài: {TimeUtil.convertUTCtoDatetime(lesson?.end_at)}</h3>
                </Col>
                <Col style={{ marginBottom: 10 }}>
                  <Countdown value={deadline} onFinish={onFinish} />
                </Col>
              </>
            ) : lesson.status === "FINISHED" ? (
              <Col style={{ fontStyle: "italic", color: "green" }}>Đã kết thúc</Col>
            ) : (
              <Col style={{ fontStyle: "italic", color: "blue" }}>Chưa có thời hạn nộp bài</Col>
            )}
          </Row>
        </Col>
        <Col>
          {teacher ? (
            <Row gutter={[10, 10]}>
              {lesson.status === "ONGOING" ? (
                <Row gutter={[5, 10]}>
                  <Col>
                    <Link to={`/teacher/lessons/edit?lessonId=${lesson?.id}`}>
                      <SC.btnWhite>Chỉnh sửa</SC.btnWhite>
                    </Link>
                  </Col>
                  <Col>
                    <Link to={`/teacher/evaluate?lessonId=${lesson?.id}`}>
                      <SC.btnGreenLight>Chấm điểm</SC.btnGreenLight>
                    </Link>
                  </Col>
                  <Col>
                    <SC.btnBlue onClick={onShowCopyLessonDrawer}>Thêm vào lớp khác</SC.btnBlue>
                  </Col>
                  <AppDrawer
                    title="Thêm dự án này vào lớp khác"
                    open={openCopyLessonDrawer}
                    onClose={onCloseCopyLessonDrawer}
                    content={<CopyLesson lesson={lesson} onClose={onCloseCopyLessonDrawer} />}
                  />
                  <Col>
                    <Popconfirm
                      placement="top"
                      title="Kết thúc ngay dự án này?"
                      onConfirm={handleFinishClick}
                      okText="Yes"
                      cancelText="No"
                    >
                      <SC.btnGray>Kết thúc ngay</SC.btnGray>
                    </Popconfirm>
                  </Col>
                </Row>
              ) : (
                <Row gutter={[5, 10]}>
                  <Col>
                    <Link to={`/teacher/evaluate?lessonId=${lesson?.id}`}>
                      <SC.btnGreenLight>Chấm điểm</SC.btnGreenLight>
                    </Link>
                  </Col>
                  <Col>
                    <SC.btnLightGreen onClick={showReOpen}>Mở lại</SC.btnLightGreen>
                  </Col>
                </Row>
              )}
              <Col>
                <SC.btnRed onClick={showDrawerNote}>Ghi chú</SC.btnRed>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <SC.btnRed onClick={showDrawerNote}>Ghi chú</SC.btnRed>
              </Col>
            </Row>
          )}
          <AppDrawer
            onClose={onCloseReOpen}
            open={reOpen}
            content={
              <>
                <Title level={2}>Mở lại dự án</Title>
                <Form>
                  <Form.Item name="endAt">
                    <h4>Thời hạn nộp bài (Tùy chọn):</h4>
                    <DatePicker
                      size="large"
                      showTime={{
                        format: "HH:mm"
                      }}
                      format={"DD-MM-yyyy HH:mm"}
                      onChange={handleEndAtChange}
                    />
                  </Form.Item>
                  <SC.btnWhite onClick={handleReOpenClick}>Lưu</SC.btnWhite>
                </Form>
              </>
            }
          />
          <AppDrawer
            onClose={onCloseNote}
            open={openNote}
            content={
              <>
                <FormViewNote currentNote={note} lessonId={lesson.id} onClose={onCloseNote} />
              </>
            }
          />
        </Col>
      </Row>
    </div>
  );
}
