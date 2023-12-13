import { Breadcrumb, Col, Form, Input, message, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import "./teacher-list-student.scss";
import TableTeacherListStudent from "../../../components/common/table/table-teacher/table-listStudent";
import BaseAPI from "../../../util/BaseAPI";
import * as SC from "../../../components/common/CustomButton/styled";

const { Option } = Select;

export default function TeacherListStudent({ classId }) {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(null);
  const [gender, setGender] = useState("ALL");

  useEffect(() => {
    getStudents();
  }, []);

  const handleStudentSearchChange = (e) => {
    setStudent(e.target.value);
  };

  const handleGenderSearchChange = (value) => {
    setGender(value);
  };

  const getStudents = () => {
    const response = BaseAPI.get(`/class-student/${classId}`, {
      params: {
        student: student,
        gender: gender === "ALL" ? null : gender
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setStudents(res.data.items);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          setStudents([]);
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setStudents([]);
      });
  };
  return (
    <div className="teacher-list-student">
      <div className="filter-teacher-liststudent">
        <Form onFinish={getStudents}>
          <Row gutter={[10, 10]} justify="start" align="bottom">
            <Col xl={6} lg={6} md={12} sm={12} xs={17}>
              <label>Học sinh</label>
              <Form.Item>
                <Input size="large" onChange={handleStudentSearchChange} />
              </Form.Item>
            </Col>
            <Col xl={3} lg={4} md={5} sm={10}>
              <label>Giới tính</label>
              <Form.Item>
                <Select defaultValue="ALL" size="large" onChange={handleGenderSearchChange}>
                  <Option value="ALL">Tất cả</Option>
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
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
      </div>
      <TableTeacherListStudent students={students} />
    </div>
  );
}
