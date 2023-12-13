import { Breadcrumb, Col, Divider, Row, Tabs, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import "./detail-lesson.scss";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import HeaderDetailLesson from "../../../components/DetailLab/HeaderDetailLesson";
import LessonComment from "../../../components/DetailLab/CommentDetailLesson";
import SubmitForm from "../../../components/DetailLab/Submit-Lab";
import { Link, useLocation } from "react-router-dom";
import BaseAPI from "../../../util/BaseAPI";
import SkeletonApp from "../../../components/common/Skeleton";
import StudentClassGroup from "../../../components/DetailLab/StudentClassGroup";
import StudentGrade from "../../../components/DetailLab/StudentGrade";
import * as S3 from "../../../util/S3Host";
import OwnerGrade from "../../../components/DetailLab/StudentGrade/OwnerGrade";

export default function StudentLessonDetail() {
  const queryString = useLocation().search;
  const lessonId = new URLSearchParams(queryString).get("lessonId");

  const [lesson, setLesson] = useState({});

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
  }, []);

  const [showbtn, setShowbtn] = useState(true);

  const setShowbtnProps = () => {
    const aaa = !showbtn;
    setShowbtn(aaa);
  };

  document.title = lesson.title || "Chi tiết dự án";
  return (
    <LayoutHomeList
      content={
        <div className="detail-lesson-student">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={`/student/subjects`}>{lesson.class_name}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/student/lessons?subjectId=${lesson.subject_id}`}>{lesson.subject_name}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Chi tiết dự án</Breadcrumb.Item>
          </Breadcrumb>
          <HeaderDetailLesson lesson={lesson} showbtn={showbtn} setShowbtnProps={setShowbtnProps} />
          <div style={{ marginBottom: 40 }}>
            <Divider orientation="left">Hiện trạng - Lý do</Divider>
            <SkeletonApp
              content={
                <Row style={{ padding: "0 20px" }}>
                  <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.context }} />
                </Row>
              }
            />
          </div>
          <div style={{ marginBottom: 40 }}>
            <Divider orientation="left">Mục tiêu dự án</Divider>
            <SkeletonApp
              content={
                <Row style={{ padding: "0 20px" }}>
                  <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.goal }} />
                </Row>
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
                      <Col xl={2} lg={4} md={18} style={{ fontWeight: 550 }}>
                        Khoa học:
                      </Col>
                      <Col>
                        <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.science }} />
                      </Col>
                    </Row>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={2} lg={4} md={18} style={{ fontWeight: 550 }}>
                        Công nghệ:
                      </Col>
                      <Col>
                        <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.technology }} />
                      </Col>
                    </Row>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={2} lg={4} md={18} style={{ fontWeight: 550 }}>
                        Kĩ thuật:
                      </Col>
                      <Col>
                        <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: lesson?.engineering }} />
                      </Col>
                    </Row>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Row style={{ padding: "0 20px", marginBottom: 10 }} justify="start">
                      <Col xl={2} lg={4} md={18} style={{ fontWeight: 550 }}>
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
              <LessonComment lesson={lesson} />
            </Tabs.TabPane>
            <Tabs.TabPane key="GROUP" tab="Nhóm">
              <StudentClassGroup lessonId={lessonId} />
            </Tabs.TabPane>
            <Tabs.TabPane key="GRADING" tab="Chấm điểm">
              <StudentGrade lesson={lesson} />
            </Tabs.TabPane>
            <Tabs.TabPane key="SUBMIT" tab="Nộp bài">
              <SubmitForm lesson={lesson} />
            </Tabs.TabPane>
            <Tabs.TabPane key="GRADE" tab="Điểm">
              <OwnerGrade lesson={lesson} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      }
    />
  );
}
