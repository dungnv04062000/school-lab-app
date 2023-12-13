import {
  Breadcrumb,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  message,
  Pagination,
  Row,
  Select,
  Tabs,
  Tooltip,
  Typography
} from "antd";
import React, { useEffect, useState } from "react";
import "./lesson-teacher.scss";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import TableTeacherListLesson from "../../../components/common/table/table-teacher/table-listLesson";
import TeacherListStudent from "../List-Student";
import { Link, useLocation } from "react-router-dom";
import BaseAPI from "../../../util/BaseAPI";
import * as SC from "../../../components/common/CustomButton/styled";
import { CloudDownloadOutlined } from "@ant-design/icons";
import * as S3 from "../../../util/S3Host";
import Loading from "../../../components/common/loading";
import AppDrawer from "../../../components/common/drawer";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function TeacherListLesson() {
  const queryString = useLocation().search;
  const classId = new URLSearchParams(queryString).get("classId");

  const [_class, setClass] = useState({});

  const [lessons, setLessons] = useState([]);
  const [currentLessonPage, setCurrentLessonPage] = useState(1);
  const [totalLessonItems, setTotalLessonItems] = useState(0);

  const [lessonSearchTitle, setLessonSearchTitle] = useState(null);
  const [lessonSearchFrom, setLessonSearchFrom] = useState(null);
  const [lessonSearchTo, setLessonSearchTo] = useState(null);
  const [level, setLevel] = useState(0);

  const handleLessonPageChange = (value) => {
    setCurrentLessonPage(value);
  };

  const handleLevelSearchChange = (value) => {
    setLevel(value);
  };

  useEffect(() => {
    const response = BaseAPI.get(`/classes/${classId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setClass(res.data.item);
        }
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    getLessons();
  }, [currentLessonPage]);

  const getLessons = () => {
    const response = BaseAPI.get("/lessons", {
      params: {
        class_id: classId,
        page: currentLessonPage,
        title: lessonSearchTitle,
        level_id: level === 0 ? null : level,
        create_at_from: lessonSearchFrom,
        create_at_to: lessonSearchTo
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setLessons(res.data.items);
          setTotalLessonItems(res.data.total_items);
        }
      })
      .catch((err) => {
        setLessons([]);
        setTotalLessonItems(0);
      });
  };

  const handleTitleSearchChange = (e) => {
    setLessonSearchTitle(e.target.value.trim());
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

    setLessonSearchFrom(createAtFrom);
    setLessonSearchTo(createAtTo);
  };

  const [downloadLoading, setDownloadLoading] = useState(false);
  const exportClassGrades = () => {
    setDownloadLoading(true);
    let response = BaseAPI.get(`/evaluations/download-final-grades/${classId}`, {
      params: {
        subject_id: subject
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          let url = `${S3.HOST}${res.data.serviceMessage}`;
          window.open(url, "_blank");
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
        setDownloadLoading(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setDownloadLoading(false);
      });
  };

  const [subjects, setSubjects] = useState([]);
  const getSubjects = () => {
    let response = BaseAPI.get("/student-subjects", {
      params: {
        subject_name: null
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setSubjects(res.data.items);
        } else {
          setSubjects([]);
        }
      })
      .catch((err) => {
        setSubjects([]);
      });
  };

  const [openDownloadDrawer, setOpenDownloadDrawer] = useState(false);

  const showDownloanDrawer = () => {
    getSubjects();
    setOpenDownloadDrawer(true);
  };
  const closeDownloanDrawer = () => {
    setOpenDownloadDrawer(false);
  };

  const [subject, setSubject] = useState(null);
  const handleSubjectChange = (value) => {
    setSubject(value);
  };

  const { Title } = Typography;

  document.title = `${_class.name}`;
  return (
    <LayoutHomeList
      content={
        <>
          <div className="list-lesson-teacher">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to={"/teacher/classes"}>Danh sách lớp</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{_class.name}</Breadcrumb.Item>
            </Breadcrumb>
            <div>{_class.grade_name}</div>
            <Title level={2}>
              {_class.name} - {_class.semester_name} - {_class.year}
            </Title>

            <Title level={5}>GVCN: {_class.form_teacher_name}</Title>
            <Tabs defaultActiveKey="LESSON">
              <Tabs.TabPane tab="Dự án" key="LESSON">
                <div className="manager-class">
                  <div className="filter-listLesson">
                    <Row justify="space-between" align="bottom">
                      <Col sm={24} md={24} lg={20} xl={20}>
                        <Form onFinish={getLessons}>
                          <Row gutter={[10, 10]} justify="start" align="bottom">
                            <Col xl={8} lg={8} md={12} sm={12} xs={24}>
                              <Form.Item>
                                <label>Dự án</label>
                                <Input size="large" onChange={handleTitleSearchChange} />
                              </Form.Item>
                            </Col>
                            <Col xl={6} lg={6} md={8} sm={12} xs={24}>
                              <Form.Item>
                                <label>Ngày bắt đầu</label>
                                <RangePicker format="DD-MM-yyyy" size="large" onChange={handleCreateAtSearchChange} />
                              </Form.Item>
                            </Col>

                            <Col xl={3} lg={4} md={6} sm={6} xs={24}>
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
                      </Col>
                      <Col>
                        <Row gutter={[10, 10]}>
                          <Col>
                            <Form.Item>
                              <Tooltip title="Tải xuống điểm">
                                <SC.btnWhite onClick={showDownloanDrawer}>
                                  <CloudDownloadOutlined style={{ fontSize: 18 }} />
                                </SC.btnWhite>
                              </Tooltip>
                              <AppDrawer
                                title="Tải xuống điểm"
                                open={openDownloadDrawer}
                                onClose={closeDownloanDrawer}
                                content={
                                  <Form>
                                    <label>Chọn môn học</label>
                                    <Form.Item>
                                      <Select size="large" placeholder="Môn học" onChange={handleSubjectChange}>
                                        {subjects.map((item) => {
                                          return (
                                            <Option key={item.id} value={item.id}>
                                              {item.name}
                                            </Option>
                                          );
                                        })}
                                      </Select>
                                    </Form.Item>
                                    <Form.Item>
                                      {downloadLoading ? (
                                        <Loading />
                                      ) : (
                                        <SC.btnBlue onClick={exportClassGrades}>Tải xuống</SC.btnBlue>
                                      )}
                                    </Form.Item>
                                  </Form>
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col>
                            <Form.Item>
                              <Link to={`/teacher/lessons/create?classId=${classId}`}>
                                <SC.btnBlue>Tạo dự án</SC.btnBlue>
                              </Link>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                  <TableTeacherListLesson
                    lessons={lessons}
                    totalItems={totalLessonItems}
                    currentPage={currentLessonPage}
                    onPageChange={handleLessonPageChange}
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Học sinh" key="STUDENT">
                <div className="manager-student">
                  <TeacherListStudent classId={classId} />
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </>
      }
    />
  );
}
