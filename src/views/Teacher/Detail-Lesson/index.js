import { Breadcrumb, Col, Divider, message, Row, Tabs, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import "./teacher-detail-lesson.scss";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import HeaderDetailLesson from "../../../components/DetailLab/HeaderDetailLesson";
import CommentDetailLesson from "../../../components/DetailLab/CommentDetailLesson";
import { useLocation, useNavigate } from "react-router-dom";
import BaseAPI from "../../../util/BaseAPI";
import SkeletonApp from "../../../components/common/Skeleton";
import TeacherClassGroup from "../../../components/DetailLab/TeacherClassGroup";
import * as S3 from "../../../util/S3Host";

export default function TeacherLessonDetail() {
  const queryString = useLocation().search;
  const lessonId = new URLSearchParams(queryString).get("lessonId");

  const [lesson, setLesson] = useState({});
  const [note, setNote] = useState(null);

  //lấy thông tin dự án
  useEffect(() => {
    let response = BaseAPI.get(`/lessons/${lessonId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setLesson(res.data.item);
        }
      })
      .catch((err) => {
        setLesson({});
      });

    let response2 = BaseAPI.get(`/notes/lesson/${lessonId}`);
    response2
      .then((res) => {
        if (res?.status === 200) {
          setNote(res.data.item);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi khi lấy dữ liệu");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi khi lấy dữ liệu");
      });
  }, []);

  const [showbtn, setShowbtn] = useState(true);

  const setShowbtnProps = () => {
    const aaa = !showbtn;
    setShowbtn(aaa);
  };
  const navigate = useNavigate();

  document.title = lesson.title || "Chỉnh sửa dự án";
  return (
    <LayoutHomeList
      content={
        <div className="detail-lesson-student">
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigate(`/teacher/classes/lessons?classId=${lesson?.class_id}`)}>
              {lesson.class_name}
            </Breadcrumb.Item>
            <Breadcrumb.Item>{lesson.subject_name}</Breadcrumb.Item>
          </Breadcrumb>
          <HeaderDetailLesson teacher note={note} lesson={lesson} showbtn={showbtn} setShowbtnProps={setShowbtnProps} />
          <div style={{ marginBottom: 40 }}>
            <Divider orientation="left">Hiện trạng - Lý do</Divider>
            <SkeletonApp
              content={
                <div style={{ padding: "0 20px" }}>
                  <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.context }} />
                </div>
              }
            />
          </div>
          <div style={{ marginBottom: 40 }}>
            <Divider orientation="left">Mục tiêu dự án</Divider>
            <SkeletonApp
              content={
                <div style={{ padding: "0 20px" }}>
                  <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.goal }} />
                </div>
              }
            />
          </div>
          <div style={{ marginBottom: 40 }}>
            <Divider orientation="left">Kiến thức STEM</Divider>
            <SkeletonApp
              content={
                <Timeline>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={2} lg={4} md={5} sm={5} xs={8} style={{ fontWeight: 550 }}>
                        Khoa học:
                      </Col>
                      <Col>
                        <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.science }} />
                      </Col>
                    </Row>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={2} lg={4} md={5} sm={5} xs={8} style={{ fontWeight: 550 }}>
                        Công nghệ:
                      </Col>
                      <Col>
                        <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.technology }} />
                      </Col>
                    </Row>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={2} lg={4} md={5} sm={5} xs={8} style={{ fontWeight: 550 }}>
                        Kĩ thuật:
                      </Col>
                      <Col>
                        <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.engineering }} />
                      </Col>
                    </Row>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={2} lg={4} md={5} sm={5} xs={8} style={{ fontWeight: 550 }}>
                        Toán học:
                      </Col>
                      <Col>
                        <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.mathematics }} />
                      </Col>
                    </Row>
                  </Timeline.Item>
                </Timeline>
              }
            />
          </div>
          <div style={{ marginBottom: 40 }}>
            <Divider orientation="left">Tiêu chí đánh giá</Divider>
            <SkeletonApp
              content={
                <Timeline>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={5} lg={10} md={12} sm={14} xs={16} style={{ fontWeight: 550 }}>
                        Giai đoạn chuẩn bị - Lên kế hoạch:
                      </Col>
                      <Col style={{ fontWeight: 550, fontSize: 18 }}> {lesson.preparation || 0} %</Col>
                    </Row>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={5} lg={10} md={12} sm={14} xs={16} style={{ fontWeight: 550 }}>
                        Giai đoạn thực hiện dự án:
                      </Col>
                      <Col style={{ fontWeight: 550, fontSize: 18 }}> {lesson.implementation || 0} %</Col>
                    </Row>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={5} lg={10} md={12} sm={14} xs={16} style={{ fontWeight: 550 }}>
                        Thuyết trình - Báo cáo dự án:
                      </Col>
                      <Col style={{ fontWeight: 550, fontSize: 18 }}> {lesson.presentation || 0} %</Col>
                    </Row>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={5} lg={10} md={12} sm={14} xs={16} style={{ fontWeight: 550 }}>
                        Sản phẩm:
                      </Col>
                      <Col style={{ fontWeight: 550, fontSize: 18 }}> {lesson.production || 0} %</Col>
                    </Row>
                  </Timeline.Item>
                </Timeline>
              }
            />
            <Divider orientation="left">Tệp đính kèm</Divider>
            {lesson?.attachment_url ? (
              <a href={`${S3.HOST}${lesson?.attachment_url}`}>
                {lesson?.attachment_url?.substring(`lessons/${lesson?.id}/`.length)}
              </a>
            ) : (
              <b>Không có</b>
            )}
          </div>

          <Tabs defaultActiveKey="COMMENT">
            <Tabs.TabPane key="COMMENT" tab="Bình luận">
              <CommentDetailLesson />
            </Tabs.TabPane>
            <Tabs.TabPane key="GROUP" tab="Nhóm">
              <TeacherClassGroup classId={lesson.class_id} lessonId={lesson.id} lessonStatus={lesson?.status} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      }
    />
  );
}
