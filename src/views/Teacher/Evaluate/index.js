import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Input,
  List,
  message,
  Modal,
  Row,
  Table,
  Tabs,
  Tooltip,
  Typography
} from "antd";
import React from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SkeletonApp from "../../../components/common/Skeleton";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import "./style.scss";
import BaseAPI from "../../../util/BaseAPI";
import MultipartAPI from "../../../util/MultipartFormDataAPI";
import { useState } from "react";
import * as SC from "../../../components/common/CustomButton/styled";
import * as S3 from "../../../util/S3Host";
import AppDrawer from "../../../components/common/drawer";
import Loading from "../../../components/common/loading";
import Dragger from "antd/lib/upload/Dragger";
import {
  CloudUploadOutlined,
  ReloadOutlined,
  EyeOutlined,
  CrownFilled,
  CloudDownloadOutlined
} from "@ant-design/icons";
import StudentExperiments from "./StudentExperiments";

const { Title } = Typography;

function Evaluate() {
  const queryString = useLocation().search;
  const lessonId = new URLSearchParams(queryString).get("lessonId");

  const [grades, setGrades] = useState([]);
  const [lesson, setLesson] = useState({});

  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };

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
    getGrades();
  }, []);

  const [loading, setLoading] = useState(false);

  const getGrades = () => {
    setLoading(true);
    let response = BaseAPI.get(`/evaluations/grades/${lessonId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setGrades(res.data.items);
        } else {
          setGrades([]);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setGrades([]);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const [groups, setGroups] = useState(null);

  useEffect(() => {
    getGroups();
  }, [lesson]);

  //lấy danh sách nhóm
  const getGroups = () => {
    let response = BaseAPI.get(`/class-groups/${lesson.class_id}/${lessonId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setGroups(res.data.items);
        } else {
          setGroups(null);
        }
      })
      .catch((err) => setGroups(null));
  };

  //tạo danh sách nhóm để filter trong bảng
  const [filterGroups, setFilterGroups] = useState([]);
  useEffect(() => {
    setFilterGroups(
      groups
        ? groups.map((group) => {
            return {
              text: group.name,
              value: group.name
            };
          })
        : []
    );
  }, [groups]);

  const [king, setKing] = useState(null);
  useEffect(() => {
    let _king = grades?.length > 0 ? grades?.reduce((a, b) => (a.experiment_count > b.experiment_count ? a : b)) : null;
    setKing(_king?.experiment_count > 0 ? _king?.student_id : null);
  }, [grades]);

  const columns = [
    {
      title: "Mã số",
      dataIndex: "student_id",
      key: "rollNumber",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.student_id.localeCompare(b.student_id),
      render: (value) => {
        return <b>{value}</b>;
      }
    },
    {
      title: "Họ tên",
      dataIndex: "student_name",
      key: "studentName",
      width: 190,
      fixed: "left",
      render: (value, item, index) => {
        return king && item?.student_id === king ? (
          <Row justify="space-between" align="middle">
            <Col>
              <b>{value}</b>
            </Col>
            <Col>
              <Tooltip title="Người thực hiện nhiều thí nghiệm nhất">
                <Button type="link">
                  <CrownFilled style={{ color: "#ffe100", fontSize: 18 }} />
                </Button>
              </Tooltip>
            </Col>
          </Row>
        ) : (
          <b>{value}</b>
        );
      }
    },
    {
      title: "Số thí nghiệm",
      dataIndex: "experiment_count",
      key: "experimentCount",
      width: 130,
      sorter: (a, b) => a.experiment_count - b.experiment_count,
      render: (value, item, index) => {
        return Number(value) > 0 ? (
          <Row justify="space-between" align="middle">
            <Col>
              <b>{value}</b>
            </Col>
            <Col>
              <Tooltip title="Chi tiết">
                <Button type="link" onClick={() => handleSelectStudent(item)}>
                  <EyeOutlined />
                </Button>
              </Tooltip>
            </Col>
          </Row>
        ) : (
          <b>{value}</b>
        );
      }
    },
    {
      title: "Nhóm",
      width: 100,
      dataIndex: "group_name",
      sorter: (a, b) => a.group_name.localeCompare(b.group_name),
      filters: filterGroups,
      onFilter: (value, record) => record.group_name.indexOf(value) === 0,
      key: "groupName"
    },

    {
      title: "Chăm chỉ",
      dataIndex: "hard_working",
      key: "hardWorking"
    },
    {
      title: "Làm việc nhóm",
      dataIndex: "teamwork",
      key: "teamwork"
    },
    {
      title: "Kỹ năng",
      dataIndex: "skill",
      key: "skill"
    },
    {
      title: "Lên kế hoạch",
      dataIndex: "preparation",
      key: "preparation"
    },
    {
      title: "Thực hiện",
      dataIndex: "implementation",
      key: "implementation"
    },
    {
      title: "Thuyết trình",
      dataIndex: "presentation",
      key: "presentation"
    },
    {
      title: "Sản phẩm",
      dataIndex: "production",
      key: "production"
    },
    {
      title: "Tổng (Nhóm)",
      dataIndex: "total",
      key: "total",
      fixed: "right",
      width: 120,
      sorter: (a, b) => a.total - b.total,
      render: (value) => <b>{value}</b>
    },
    {
      title: "Điểm",
      dataIndex: "grade",
      key: "grade",
      fixed: "right",
      width: 80,
      sorter: (a, b) => a.grade - b.grade,
      render: (value) => {
        return (
          <b
            style={{
              color: value >= 8 ? "green" : value > 6 && value < 8 ? "blue" : value > 4 && value <= 6 ? "orange" : "red"
            }}
          >
            {value}
          </b>
        );
      }
    }
  ];

  //chấm điểm theo template
  const [openDrawer, setOpenDrawer] = useState(false);
  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [createTemplateLoading, setCreateTemplateLoading] = useState(false);
  const [templateLink, setTemplateLink] = useState(null);
  const handleCreateTemplate = () => {
    setCreateTemplateLoading(true);
    let response = BaseAPI.get(`/evaluations/download-lesson-grades/${lessonId}`, {
      params: {
        is_result: false
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setTemplateLink(`${S3.HOST}${res.data.serviceMessage}`);
        } else {
          setTemplateLink(null);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
        setCreateTemplateLoading(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setTemplateLink(null);
        setCreateTemplateLoading(false);
      });
  };

  const exportGrades = () => {
    setDownloadLoading(true);
    let response = BaseAPI.get(`/evaluations/download-lesson-grades/${lessonId}`, {
      params: {
        is_result: true
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

  const [file, setFile] = useState({});

  const dummyRequest = ({ file, onSuccess, onFailure }) => {
    setTimeout(() => {
      setFile(file);
      onSuccess("ok");
    }, 2000);
  };

  const beforeUpload = (file) => {
    if (file.size > 25000000) {
      setFile({});
      message.error("Kích thước file này đã vượt quá 25MB, không thể tải lên");
      return false;
    } else {
      return true;
    }
  };

  const onRemove = () => {
    setFile({});
  };

  const props = {
    name: "file",
    accept: ".xlsx",
    multiple: false,
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`Tải lên thành công file ${info.file.name}`);
      } else if (status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
    beforeUpload: beforeUpload,
    onRemove: onRemove,
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068"
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`
    }
  };

  const [submitGradeLoading, setSubmitGradeLoading] = useState(false);
  const handleSubmitGrades = () => {
    setSubmitGradeLoading(true);
    var formData = new FormData();
    formData.append("file", file);
    let response = MultipartAPI.post(`evaluations/template/${lessonId}`, formData);

    response
      .then((res) => {
        if (res?.status === 201) {
          message.success("Lưu điểm thành công");
          getGrades();
          setOpenDrawer(false);
          setFile(null);
          onRemove();
        } else {
          message.error(res?.response?.data?.message || "Lưu điểm thất bại");
        }
        setSubmitGradeLoading(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setSubmitGradeLoading(false);
      });
  };

  //chấm điểm theo nhóm
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [grade, setGrade] = useState(0);
  const showModal = (group) => {
    setSelectedGroup(group);
    setOpen(true);
  };
  const handleSubmitGroupGrade = () => {
    setConfirmLoading(true);
    let response = BaseAPI.post(`/evaluations/group`, {
      group_id: selectedGroup?.id,
      lesson_id: lessonId,
      grade: grade
    });
    response
      .then((res) => {
        if (res?.status === 201) {
          message.success("Lưu điểm thành công");
          getGrades();
          setGrade(0);
          setOpen(false);
        } else {
          message.error(res?.response?.data?.message || "Lưu điểm thất bại");
        }
        setConfirmLoading(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setSubmitGradeLoading(false);
      });
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
  };

  return (
    <LayoutHomeList
      content={
        <div className="content">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={`/teacher/classes/lessons?classId=${lesson?.class_id}`}>{lesson?.class_name}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Đánh giá điểm</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={2}>{lesson?.title}</Title>

          <Tabs>
            <Tabs.TabPane key="GradeList" tab="Thống kê điểm">
              <Row gutter={[10, 10]}>
                <Col>
                  <SC.btnWhite onClick={getGrades}>
                    <ReloadOutlined />
                  </SC.btnWhite>
                </Col>
                <Col>
                  <Tooltip title="Tải xuống">
                    {downloadLoading ? (
                      <Loading />
                    ) : (
                      <SC.btnBlue onClick={exportGrades}>
                        <CloudDownloadOutlined style={{ fontSize: 19 }} />
                      </SC.btnBlue>
                    )}
                  </Tooltip>
                </Col>
              </Row>
              <Row style={{ fontStyle: "italic", color: "orange", marginTop: 20 }}>
                Bảng thống kê dưới dây là điểm trung bình được đánh giá của mỗi học sinh
              </Row>
              <SkeletonApp
                style={{ marginTop: "20px" }}
                content={
                  <>
                    <Table
                      rowKey={"student_id"}
                      size="small"
                      columns={columns}
                      dataSource={grades}
                      bordered="true"
                      pagination={false}
                      loading={loading}
                      scroll={{
                        x: 1200,
                        y: 600
                      }}
                    />
                    <StudentExperiments student={selectedStudent} lesson={lesson} />
                  </>
                }
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="Grading" tab="Đánh giá điểm">
              <Row gutter={[10, 10]} style={{ marginBottom: 20 }}>
                <Col>
                  <SC.btnWhite onClick={getGroups}>
                    <ReloadOutlined />
                  </SC.btnWhite>
                </Col>
                <Col>
                  <SC.btnBlue onClick={showDrawer}>Chấm theo mẫu</SC.btnBlue>
                </Col>
              </Row>
              <Divider orientation="left">Chấm theo nhóm</Divider>
              <List
                style={{ width: "100%" }}
                grid={{
                  gutter: 10,
                  column: 1
                }}
                dataSource={groups}
                renderItem={(item) => (
                  <List.Item key={item.id}>
                    <Card title={item.name}>
                      <Row justify="space-between" align="middle" style={{ fontWeight: 550 }}>
                        <Col xl={4} lg={6} md={8} sm={24} xs={24}>
                          {item?.members?.map((member) => {
                            return (
                              <Row>
                                <Col>
                                  <strong>{member?.member_id}</strong>
                                </Col>
                                <Col> - {member?.member_name}</Col>
                              </Row>
                            );
                          })}
                        </Col>
                        <Row gutter={[30, 10]}></Row>
                        {lesson?.status === "ONGOING" && (
                          <Col>
                            <SC.btnGreenLight onClick={() => showModal(item)}>Chấm điểm</SC.btnGreenLight>
                          </Col>
                        )}
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
              <Modal
                title={selectedGroup?.name}
                open={open}
                onOk={handleSubmitGroupGrade}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={[
                  <Button key="submit" type="primary" loading={confirmLoading} onClick={handleSubmitGroupGrade}>
                    Lưu điểm
                  </Button>
                ]}
              >
                <Title level={5}>Các thành viên</Title>
                {selectedGroup?.members.map((member) => {
                  return (
                    <Row>
                      <Col span={4}>
                        <strong>{member?.member_id}</strong>
                      </Col>
                      <Col>{member?.member_name}</Col>
                    </Row>
                  );
                })}
                <Divider />
                <h5>Nhập điểm</h5>
                <Input type="number" min={0} max={10} value={grade} onChange={handleGradeChange} />
              </Modal>
              <AppDrawer
                content={
                  <>
                    <Title level={2} style={{ margin: "30px 0" }}>
                      Chấm điểm theo mẫu
                    </Title>
                    <div
                      style={{
                        fontStyle: "italic",
                        marginBottom: 10
                      }}
                    >
                      Tạo và tải xuống danh sách thống kê điểm dánh giá và điềm vào cột điểm
                    </div>
                    {createTemplateLoading ? (
                      <Loading />
                    ) : (
                      <SC.btnLightGreen onClick={handleCreateTemplate}>Tạo danh sách</SC.btnLightGreen>
                    )}
                    {templateLink && (
                      <Row align="bottom" style={{ margin: "10px 0" }}>
                        Đã tạo xong
                        <a style={{ fontSize: 16, marginLeft: 10 }} href={templateLink} target={"_blank"}>
                          Tải xuống
                        </a>
                      </Row>
                    )}
                    <Dragger maxCount={1} {...props} style={{ width: "100%", height: "300px" }}>
                      <p className="ant-upload-drag-icon">
                        <CloudUploadOutlined />
                      </p>
                      <p className="ant-upload-text">Chọn hoặc kéo thả file vào đây để tải lên</p>
                      <br />
                      <h4>Nếu chưa có mẫu, vui lòng tạo và tải mẫu ở trên về rồi điền vào mẫu</h4>
                    </Dragger>
                    <Row style={{ marginTop: 20 }}>
                      {submitGradeLoading ? (
                        <Loading />
                      ) : (
                        <SC.btnGreenLight onClick={handleSubmitGrades}>Lưu điểm</SC.btnGreenLight>
                      )}
                    </Row>
                  </>
                }
                open={openDrawer}
                onClose={closeDrawer}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      }
    />
  );
}

export default Evaluate;
