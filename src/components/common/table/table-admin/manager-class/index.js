import { Button, Col, Form, Input, message, Popconfirm, Row, Select, Skeleton, Space, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as SC from "../../../CustomButton/styled";
import AppDrawer from "../../../drawer";
import FormCreateClass from "../../../form/form-admin/create-class";
import SkeletonApp from "../../../Skeleton";
import "./style.scss";
import BaseAPI from "../../../../../util/BaseAPI";
import { userInfoSelector } from "../../../../../redux/selector";
import { useSelector } from "react-redux";
import { QuestionCircleOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import * as TimeUtil from "../../../../../util/TimeUtil";

const { Option } = Select;

export default function TableAdManagerClass({ semesterId }) {
  const nagative = useNavigate();

  const userInfo = useSelector(userInfoSelector);

  const [open, setOpen] = useState(false);
  const [gradeId, setGradeId] = useState(0);
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState(null);
  const [formTeacher, setFormTeacher] = useState(null);

  useEffect(() => {
    if (semesterId) {
      getClasses();
    }
  }, []);

  const getClasses = () => {
    let response = BaseAPI.get(`/classes/admin-schools`, {
      params: {
        semester_id: semesterId,
        campus_id: userInfo?.campus_id,
        grade_id: gradeId === 0 ? null : gradeId,
        class_name: className?.trim()?.length > 0 ? className.trim() : null,
        form_teacher: formTeacher?.trim()?.length > 0 ? formTeacher.trim() : null
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setClasses(res.data.items);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          setClasses(null);
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setClasses(null);
      });
  };

  const handleDeleteClass = (id) => {
    const response = BaseAPI.delete(`/classes/${id}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Xoá lớp học thành công.");
          getClasses();
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleGradeChange = (value) => {
    setGradeId(value);
  };

  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
  };

  const handleFormTeacherChange = (e) => {
    setFormTeacher(e.target.value);
  };

  const columns = [
    {
      title: "Tên lớp",
      width: 100,
      dataIndex: "name",
      key: "className",
      fixed: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value) => <b>{value}</b>
    },
    {
      title: "Khối",
      width: 100,
      dataIndex: "grade_name",
      sorter: (a, b) => a.grade_name.localeCompare(b.grade_name),
      key: "className"
    },

    {
      title: "Số học sinh",
      dataIndex: "student_count",
      key: "studentCount",
      width: 100
    },
    {
      title: "Ngày tạo",
      dataIndex: "create_at",
      key: "createAt",
      width: 110,
      render: (value) => {
        return TimeUtil.convertUTCtoDate(value);
      }
    },
    {
      title: "GVCN",
      width: 120,
      dataIndex: "form_teacher_id",
      key: "formTeacherId"
    },
    {
      title: "Tên giáo viên chủ nhiệm",
      dataIndex: "form_teacher_name",
      key: "formTeacherName"
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 120,
      align: "center",
      key: "action",
      fixed: "right",
      render: (_, item) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <SC.btnLightGreen onClick={() => nagative(`/school-admin/classes/detail?classId=${item.id}`)}>
              <EyeOutlined />
            </SC.btnLightGreen>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa lớp này khỏi trường?"
              onConfirm={() => handleDeleteClass(item.id)}
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
              <SC.btnRed type="primary">
                <DeleteOutlined />
              </SC.btnRed>
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <>
      <div className="filter-manager-class">
        <Row justify="space-between" align="bottom">
          <Col sm={24} lg={20} xl={20}>
            <Form onFinish={getClasses}>
              <Row gutter={[10, 10]} justify="start" align="bottom">
                <Col xl={6} lg={8} md={8} sm={12} xs={12}>
                  <Form.Item>
                    <label>Giáo viên chủ nhiệm</label>
                    <Input size="large" onBlur={handleFormTeacherChange} />
                  </Form.Item>
                </Col>
                <Col xl={6} lg={8} md={8} sm={12} xs={12}>
                  <Form.Item>
                    <label>Tên lớp</label>
                    <Input size="large" onBlur={handleClassNameChange} />
                  </Form.Item>
                </Col>
                <Col xl={4} lg={4} md={4} sm={6} xs={12}>
                  <label>Khối</label>
                  <Form.Item>
                    <Select defaultValue="Tất cả" size="large" onChange={handleGradeChange}>
                      <Option key={0} value={0}>
                        Tất cả
                      </Option>
                      <Option key={1} value={1}>
                        Khối 10
                      </Option>
                      <Option key={2} value={2}>
                        Khối 11
                      </Option>
                      <Option key={3} value={3}>
                        Khối 12
                      </Option>
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
              <SC.btnBlue onClick={showDrawer}>Tạo lớp học</SC.btnBlue>
            </Form.Item>
          </Col>
        </Row>
        <AppDrawer
          title="Tạo lớp học"
          onClose={onClose}
          open={open}
          content={
            <>
              <FormCreateClass refresh={getClasses} onClose={onClose} />
            </>
          }
        />
      </div>
      <h2>Danh sách lớp</h2>
      <SkeletonApp
        content={
          <>
            <Row>
              <span>
                Tổng số lớp: <strong>{classes?.length}</strong>
              </span>
            </Row>
            <Table
              rowKey={"id"}
              size="small"
              dataSource={classes}
              columns={columns}
              style={{ minHeight: 700 }}
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
          </>
        }
      />
    </>
  );
}
