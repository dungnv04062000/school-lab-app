import { Breadcrumb, Col, Form, Input, message, Row, Select, Tabs, Typography } from "antd";
import React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TableClassStudents from "../../../../components/common/table/table-admin/manager-class/class-students";
import LayoutHomeAdmin from "../../../../components/layouts/adminLayout";
import * as SC from "../../../../components/common/CustomButton/styled";
import "./style.scss";
import BaseAPI from "../../../../util/BaseAPI";
import { useEffect } from "react";
import TableClassTeacher from "../../../../components/common/table/table-admin/manager-class/class-teacher";
import Loading from "../../../../components/common/loading";
import AppDrawer from "../../../../components/common/drawer";

const { Title } = Typography;
const { Option } = Select;

export default function AdminDetailClass() {
  const queryString = useLocation().search;
  const classId = new URLSearchParams(queryString).get("classId");

  const [_class, setClass] = useState(null);

  useEffect(() => {
    getClass();
  }, []);

  const getClass = () => {
    let response = BaseAPI.get(`/classes/${classId}`);

    response
      .then((res) => {
        if (res?.status === 200) {
          setClass(res.data.item);
          setGradeId(res.data.item?.grade_id);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          setClass(null);
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setClass(null);
      });
  };

  useEffect(() => {
    setClassName(_class?.name);
    setFormTeacherId(_class?.form_teacher_id);
  }, [_class]);

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState(null);
  const [gradeId, setGradeId] = useState(0);
  const [formTeacherId, setFormTeacherId] = useState(null);

  const handleGradeChange = (value) => {
    setGradeId(value);
  };

  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
  };

  const handleFormTeacherIdChange = (value) => {
    if (value === "NONE") {
      console.log("nn");
      setFormTeacherId(null);
    } else {
      setFormTeacherId(value);
    }
  };

  const handleUpdateClass = () => {
    if (className?.trim()?.length === 0) {
      message.error("Tên lớp không được để trống");
    } else {
      setLoading(true);
      let response = BaseAPI.patch(`/classes/${classId}`, {
        name: className?.trim()?.length > 0 ? className?.trim() : null,
        grade_id: gradeId,
        form_teacher_id: formTeacherId ? formTeacherId : null
      });

      response
        .then((res) => {
          if (res?.status === 200) {
            message.success("Cập nhật thành công");
          } else {
            message.error(res?.response?.data?.message || "Cập nhật thất bại");
          }
          setLoading(false);
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        });
      setLoading(false);
    }
  };

  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    let response = BaseAPI.get("/campus-teachers", {
      params: {
        campus_id: _class?.campus_id,
        semester_id: _class?.semester_id
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setTeachers(res.data.items);
        } else {
          setTeachers([]);
        }
      })
      .catch((err) => {
        setTeachers([]);
      });
  }, [_class]);

  document.title = _class ? `${_class?.name} - ${_class?.semester_name} ${_class?.year}` : "Thông tin lớp học";
  return (
    <LayoutHomeAdmin
      content={
        <div className="admin-detail-class">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={"/school-admin"}>Quay lại</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Row justify="space-between" align="top">
            <Col>
              <Title level={2}>Thông tin lớp học</Title>
              <div>
                Học kỳ:{" "}
                <strong style={{ fontSize: 18 }}>
                  {_class?.semester_name} - {_class?.year}
                </strong>
              </div>
              <div>
                Lớp:{" "}
                <strong style={{ fontSize: 18 }}>
                  {_class?.name} - {_class?.grade_name}
                </strong>
              </div>
              <div>
                Giáo viên chủ nhiệm:{" "}
                <strong style={{ fontSize: 18 }}>
                  {_class?.form_teacher_id} - {_class?.form_teacher_name}
                </strong>
              </div>
            </Col>
            <Col>
              <SC.btnBlue onClick={showModal}>Chỉnh sửa</SC.btnBlue>
            </Col>
            <AppDrawer
              title="Chỉnh sửa lớp học"
              open={open}
              onClose={handleClose}
              content={
                <>
                  <Form onFinish={handleUpdateClass}>
                    <label>Khối</label>
                    <Form.Item>
                      <Select defaultValue={gradeId} size="large" onChange={handleGradeChange}>
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
                    <label>Tên lớp</label>
                    <Form.Item name="className" initialValue={className}>
                      <Input type="text" size="large" onBlur={handleClassNameChange} />
                    </Form.Item>
                    <label>Giáo viên chủ nhiệm</label>
                    <Form.Item name="formTeacherId" initialValue={formTeacherId}>
                      <Select size="large" onChange={handleFormTeacherIdChange}>
                        <Select.Option key={"NONE"} value={"NONE"}>
                          Không chọn
                        </Select.Option>
                        {teachers.map((item) => {
                          return (
                            <Option key={item.id} value={item.id} disabled={item?.id === formTeacherId}>
                              {item.id} {" - "}
                              {item.full_name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item>{loading ? <Loading /> : <SC.btnBlue>Cập nhật</SC.btnBlue>}</Form.Item>
                  </Form>
                </>
              }
            />
          </Row>
          <Tabs defaultActiveKey="STUDENTS">
            <Tabs.TabPane tab="Danh sách học sinh" key="STUDENTS">
              <div className="manager-class">
                <TableClassStudents classId={classId} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Giáo viên bộ môn" key="TEACHERS">
              <TableClassTeacher className="manager-teacher" classId={classId} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      }
    />
  );
}
