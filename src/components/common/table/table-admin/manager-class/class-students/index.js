import { Table, Space, Row, Col, Form, Select, Input, message, Popconfirm, Drawer, Button, Tooltip } from "antd";
import React from "react";
import * as SC from "../../../../CustomButton/styled";
import SkeletonApp from "../../../../Skeleton";
import { useState } from "react";
import BaseAPI from "../../../../../../util/BaseAPI";
import MultipartAPI from "../../../../../../util/MultipartFormDataAPI";
import { useEffect } from "react";
import * as TimeUtil from "../../../../../../util/TimeUtil";
import { QuestionCircleOutlined, CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger";
import Loading from "../../../../loading";
import * as S3 from "../../../../../../util/S3Host";

export default function TableAdDetailClass({ classId }) {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(null);
  const [gender, setGender] = useState("ALL");

  const [open, setOpen] = useState(false);
  const [openAddOne, setOpenAddOne] = useState(false);

  const [loading, setLoading] = useState(false);
  const [rollNumber, setRollNumber] = useState(null);

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = () => {
    let response = BaseAPI.get(`/class-student/${classId}`, {
      params: {
        student: student?.trim(),
        gender: gender === "ALL" ? null : gender
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setStudents(res.data.items);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          setStudents(null);
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setStudents(null);
      });
  };

  const handleStudentChange = (e) => {
    setStudent(e.target.value);
  };

  const handleGenderChange = (value) => {
    setGender(value);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showAddOneDrawer = () => {
    setOpenAddOne(true);
  };

  const onAddOneClose = () => {
    setOpenAddOne(false);
  };

  const [file, setFile] = useState(null);
  const [isValidFile, setIsValidFile] = useState(true);

  const dummyRequest = ({ file, onSuccess, onFailure }) => {
    setTimeout(() => {
      setFile(file);
      onSuccess("ok");
    }, 2000);
  };

  const beforeUpload = (file) => {
    if (file.size > 25000000) {
      setFile({});
      setIsValidFile(false);
      message.error("Kích thước file này đã vượt quá 25MB, không thể tải lên");
      return false;
    } else {
      setIsValidFile(true);
      return true;
    }
  };

  const onRemove = () => {
    setFile(null);
    setIsValidFile(true);
  };

  const props = {
    name: "file",
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

  const handleRollNumberChange = (e) => {
    setRollNumber(e.target.value.trim());
  };

  const handleSaveOne = () => {
    setLoading(true);
    let response = BaseAPI.post(`/class-student/save-one`, {
      class_id: classId,
      student_id: rollNumber
    });
    response
      .then((res) => {
        if (res?.status === 201) {
          message.success("Thêm thành công");
          getStudents();
          onAddOneClose();
        } else {
          message.error(res?.response?.data?.message || "Thêm học sinh thất bại");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const handleSaveByTemplate = () => {
    if (!file) {
      message.warning("Vui lòng chọn file");
    } else {
      setLoading(true);
      let response = MultipartAPI.post(`/class-student/save-many`, {
        classId: classId,
        isOverride: true,
        file: file
      });
      response
        .then((res) => {
          if (res?.status === 201) {
            message.success("Thêm thành công");
            getStudents();
            onClose();
          } else {
            message.error(res?.response?.data?.message || "Thêm thất bại");
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        });
    }
  };

  const handleRemoveClassStudent = (classStudent) => {
    let response = BaseAPI.delete(`/class-student/${classStudent?.id}`);
    return response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Xóa thành công");
          getStudents();
        } else {
          message.error(res?.response?.data?.service_message || "Xóa thất bại");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const columns = [
    {
      title: "Mã số",
      dataIndex: "roll_number",
      width: 100,
      fixed: "left",
      key: "rollNumber",
      sorter: (a, b) => a.roll_number.localeCompare(b.roll_number),
      render: (value) => {
        return <b>{value}</b>;
      }
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "name",
      ellipsis: true
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      filters: [
        {
          text: "Nam",
          value: "MALE"
        },
        {
          text: "Nữ",
          value: "FEMALE"
        }
      ],
      filterSearch: true,
      onFilter: (value, record) => record.gender.startsWith(value),
      render: (value) => {
        return value === "MALE" ? "Nam" : "Nữ";
      }
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_date",
      key: "dob",
      width: 110,
      render: (value) => {
        return value ? TimeUtil.convertUTCtoDate(value) : "";
      }
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone",
      width: 140
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 100,
      key: "action",
      fixed: "right",
      align: "center",
      render: (_, item, index) => (
        <Space size="small">
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa học sinh này khỏi lớp?"
              onConfirm={() => handleRemoveClassStudent(item)}
              placement="topRight"
              okText="Xóa"
              cancelText="Hủy bỏ"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red"
                  }}
                />
              }
            >
              <SC.btnRed>
                <DeleteOutlined />
              </SC.btnRed>
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="table-ad-detail-class">
      <Row justify="space-between" align="bottom">
        <Col sm={24} lg={20} xl={20}>
          <Form onFinish={getStudents}>
            <Row gutter={[10, 10]} justify="start" align="bottom">
              <Col xl={6} lg={6} md={8} sm={12} xs={24}>
                <Form.Item>
                  <label>Học sinh</label>
                  <Input size="large" onBlur={handleStudentChange} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={5} md={6} lg={6}>
                <label>Giới tính</label>
                <Form.Item>
                  <Select defaultValue="Tất cả" size="large" onChange={handleGenderChange}>
                    <Select.Option value={"ALL"}>Tất cả</Select.Option>
                    <Select.Option value={"MALE"}>Nam</Select.Option>
                    <Select.Option value={"FEMALE"}>Nữ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item htmlFor="submit">
                  <SC.btnWhite>Tìm kiếm</SC.btnWhite>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col>
          <Form.Item>
            <SC.btnBlue onClick={showDrawer}>Thêm học sinh</SC.btnBlue>
          </Form.Item>
        </Col>
      </Row>
      <Drawer
        title="Thêm học sinh vào lớp này"
        size="large"
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button type="primary" onClick={showAddOneDrawer}>
              Thêm 1 học sinh
            </Button>
          </Space>
        }
      >
        <>
          <Row style={{ marginBottom: 10, fontStyle: "italic" }}>Tải xuống mẫu danh sách học sinh cần thêm</Row>
          <Row>
            <a href={`${S3.HOST}templates/class_student/Template_Class_Student.xlsx`}>
              <SC.btnGreenLight>Tải xuống</SC.btnGreenLight>
            </a>
          </Row>
          <Dragger maxCount={1} {...props} style={{ width: "100%" }}>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">Chọn hoặc kéo thả file vào đây để tải lên</p>
            <p className="ant-upload-hint warning">
              Nếu có nhiều hơn 1 tệp cần nộp, hãy nén tất cả lại nhé
              <br />
              Vui lòng tải lên file có kích thước nhỏ hơn 25MB
            </p>
          </Dragger>
          <Row style={{ marginTop: 10 }}>
            {loading ? (
              <Loading />
            ) : isValidFile ? (
              <SC.btnBlue onClick={handleSaveByTemplate}>Thêm</SC.btnBlue>
            ) : (
              "Kích thước file quá lớn, không thể tải lên"
            )}
          </Row>

          <Drawer title="Thêm 1 học sinh" open={openAddOne} onClose={onAddOneClose}>
            <Form onFinish={handleSaveOne}>
              <label>Mã số</label>
              <Form.Item
                name="rollNumber"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã số học sinh cần thêm"
                  }
                ]}
              >
                <Input type="text" size="large" onBlur={handleRollNumberChange} />
              </Form.Item>
              {loading ? <Loading /> : <SC.btnBlue type="submit">Thêm</SC.btnBlue>}
            </Form>
          </Drawer>
        </>
      </Drawer>
      <h3>
        Số học sinh: <strong>{students?.length}</strong>
      </h3>
      <SkeletonApp
        content={
          <Table
            rowKey={"id"}
            size="small"
            columns={columns}
            dataSource={students}
            bordered="true"
            scroll={{
              x: 1000
            }}
            pagination={{
              showSizeChanger: false,
              hideOnSinglePage: true,
              position: ["none", "bottomCenter"]
            }}
          />
        }
      />
    </div>
  );
}
