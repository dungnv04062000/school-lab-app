import { Col, Form, Input, message, Progress, Row, Select, Table, Tag, Tooltip, Typography } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LayoutHomeList from "../../components/layouts/mainLayout";
import { semestersSelector } from "../../redux/selector";
import BaseAPI from "../../util/BaseAPI";
import * as SC from "../../components/common/CustomButton/styled";
import "./style.scss";
import SkeletonApp from "../../components/common/Skeleton";
import * as S3 from "../../util/S3Host";
import Loading from "../../components/common/loading";

const { Option } = Select;
const { Title } = Typography;

export default function Result() {
  const semesters = useSelector(semestersSelector);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);
  const [semesterId, setSemesterId] = useState(semesters[0]?.id);

  const [loading, setLoading] = useState(false);

  const handleClassIdChange = (value) => {
    setClassId(value);
  };

  const handleChangeSemester = (value) => {
    setSemesterId(value);
  };

  const handleSubjectChange = (value) => {
    setSubjectId(value);
  };

  const getTeacherClasses = () => {
    const response = BaseAPI.get(`/classes/teacher`, {
      params: {
        semester_id: semesterId,
        grade_id: null,
        class_name: null,
        form_teacher: null
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setClasses(res.data.items);
        } else {
          setClasses([]);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        setClasses([]);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };
  const getGrades = () => {
    if (!semesterId) {
      message.error("Vui lòng chọn học kỳ");
    } else if (!classId) {
      message.error("Vui lòng chọn lớp học");
    } else if (!subjectId) {
      message.error("Vui lòng chọn môn học");
    } else {
      setLoading(true);
      let response = BaseAPI.get(`/evaluations/final-grades/${classId}`, {
        params: {
          subject_id: subjectId
        }
      });
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
          setGrades([]);
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
          setLoading(false);
        });
    }
  };

  const getSubjects = () => {
    let response = BaseAPI.get(`/subjects`);
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

  useEffect(() => {
    getSubjects();
  }, []);

  useEffect(() => {
    if (semesterId) {
      setClasses([]);
      getTeacherClasses();
    }
  }, [semesterId]);

  const columns = [
    {
      title: "STT",
      key: "no",
      width: 50,
      fixed: "left",
      align: "center",
      render: (value, item, index) => index + 1
    },
    {
      title: "Mã số",
      dataIndex: "roll_number",
      key: "rollNumber",
      width: 100,
      fixed: "left",
      render: (value) => <b>{value}</b>
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "fullName",
      fixed: "left",
      ellipsis: true
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 260
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 90,
      render: (value) => (value === "MALE" ? "Nam" : "Nữ")
    },
    {
      title: "Số thí nghiệm",
      dataIndex: "experiment_count",
      key: "experimentCount",
      width: 130,
      sorter: (a, b) => a.experiment_count - b.experiment_count,
      render: (value) => <b>{value}</b>
    },
    {
      title: "Điểm trung bình",
      dataIndex: "grade",
      key: "grade",
      width: 150,
      //   fixed: "right",
      sorter: (a, b) => a.grade - b.grade,
      render: (value) => (
        <Progress
          percent={value * 10}
          format={(percent) => <b>{percent / 10}</b>}
          strokeColor={
            Number(value) >= 9
              ? "green"
              : Number(value) >= 8 && Number(value) < 9
              ? "#52C41A"
              : Number(value) >= 5 && Number(value) < 8
              ? "#188FFD"
              : Number(value) >= 3 && Number(value) < 5
              ? "#FF4D4F"
              : "red"
          }
        />
      )
    },
    {
      title: "Trạng thái",
      //   dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 120,
      align: "center",
      render: (value, item, index) => (
        <Tag
          color={
            Number(item?.grade) >= 9
              ? "#22a000"
              : Number(item?.grade) >= 8 && Number(item?.grade) < 9
              ? "#52C41A"
              : Number(item?.grade) >= 5 && Number(item?.grade) < 8
              ? "#188FFD"
              : "#ff0000"
          }
        >
          <b>
            {Number(item?.grade) >= 9
              ? "Xuất sắc"
              : Number(item?.grade) >= 8 && Number(item?.grade) < 9
              ? "Giỏi"
              : Number(item?.grade) >= 5 && Number(item?.grade) < 8
              ? "Đạt"
              : "Chưa Đạt"}
          </b>
        </Tag>
      )
    }
  ];

  const [downloadLoading, setDownloadLoading] = useState(false);
  const exportClassGrades = () => {
    if (!semesterId) {
      message.error("Vui lòng chọn học kỳ");
    } else if (!classId) {
      message.error("Vui lòng chọn lớp học");
    } else if (!subjectId) {
      message.error("Vui lòng chọn môn học");
    } else {
      setDownloadLoading(true);
      let response = BaseAPI.get(`/evaluations/download-final-grades/${classId}`, {
        params: {
          subject_id: subjectId
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
    }
  };

  document.title = "Thống kê kết quả";
  return (
    <LayoutHomeList
      content={
        <div className="result-wrapper">
          <Title level={3}>Thống kê kết quả học sinh</Title>
          <Form>
            <Row gutter={[10, 10]} align="bottom">
              <Col xxl={4} xl={4} lg={6} md={8} sm={12} xs={24}>
                <label>Học kỳ</label>
                <Form.Item>
                  <Select
                    defaultValue={semesterId}
                    size="large"
                    onChange={handleChangeSemester}
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
              <Col xxl={4} xl={4} lg={4} md={6} sm={12} xs={24}>
                <label>Lớp</label>
                <Form.Item>
                  <Select size="large" onChange={handleClassIdChange} placeholder="Chọn lớp">
                    {classes.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xxl={4} xl={4} lg={4} md={6} sm={12} xs={24}>
                <label>Môn học</label>
                <Form.Item>
                  <Select size="large" onChange={handleSubjectChange} placeholder="Chọn môn học">
                    {subjects.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <SC.btnWhite onClick={getGrades}>Tìm kiếm</SC.btnWhite>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {downloadLoading ? (
                    <Loading />
                  ) : (
                    <Tooltip title="Tải xuống">
                      <SC.btnBlue onClick={exportClassGrades}>
                        <CloudDownloadOutlined />
                      </SC.btnBlue>
                    </Tooltip>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <SkeletonApp
            content={
              <Table
                dataSource={grades}
                rowKey={"roll_number"}
                columns={columns}
                bordered
                scroll={{
                  x: 1100,
                  y: 600
                }}
                size="small"
                loading={loading}
                pagination={false}
              />
            }
          />
        </div>
      }
    />
  );
}
