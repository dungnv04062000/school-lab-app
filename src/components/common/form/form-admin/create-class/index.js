import { Col, Form, Input, message, Row, Select } from "antd";
import React, { useEffect } from "react";
import "./form-create-class.scss";
import * as SC from "../../../CustomButton/styled";
import { useState } from "react";
import BaseAPI from "../../../../../util/BaseAPI";
import { useSelector } from "react-redux";
import { semestersSelector, userInfoSelector } from "../../../../../redux/selector";
import Loading from "../../../loading";

const { Option } = Select;

export default function FormCreateClass({ refresh, onClose }) {
  const userInfo = useSelector(userInfoSelector);
  const [className, setClassName] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [gradeId, setGradeId] = useState(null);

  const [loading, setLoading] = useState(false);

  const semesters = useSelector(semestersSelector);
  const [semesterId, setSemesterId] = useState(semesters[0]?.id);

  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    let response = BaseAPI.get("/campus-teachers", {
      params: {
        campus_id: userInfo.campus_id,
        semester_id: semesterId
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
  }, []);

  const handleCreateClass = () => {
    setLoading(true);
    let response = BaseAPI.post("/classes", {
      name: className,
      semester_id: semesterId,
      campus_id: userInfo.campus_id,
      grade_id: gradeId,
      form_teacher_id: teacherId
    });
    response
      .then((res) => {
        if (res?.status === 201) {
          message.success("Tạo lớp học thành công");
          refresh();
          onClose();
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau");
      });
  };

  const handleSemesterChange = (value) => {
    setSemesterId(value);
  };

  const handleChangeClassName = (e) => {
    setClassName(e.target.value);
  };

  const handleChangeTecher = (value) => {
    if (value === "NONE") {
      setTeacherId(null);
    } else {
      setTeacherId(value);
    }
  };

  const handleChangeGrade = (value) => {
    setGradeId(value);
  };

  return (
    <div className="form-create-class">
      <Form onFinish={handleCreateClass}>
        <Row>
          <Col span={24}>
            <Form.Item>
              <label>Học kỳ</label>
              <Select defaultValue={semesterId} size="large" onChange={handleSemesterChange} placeholder="Chọn học kỳ">
                {semesters.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name} - {item.year}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <label>Tên lớp</label>
            <Form.Item
              name="nameClass"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên lớp"
                }
              ]}
            >
              <Input id="nameClass" size="large" value={className} onChange={handleChangeClassName} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <label>Giáo viên chủ nhiệm</label>
            <Form.Item>
              <Select size="large" onChange={handleChangeTecher}>
                <Select.Option key={"NONE"} value={"NONE"}>
                  Không chọn
                </Select.Option>
                {teachers.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.id} {" - "}
                      {item.full_name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <label>Khối</label>
            <Form.Item
              name="grade"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn khối"
                }
              ]}
            >
              <Select size="large" onChange={handleChangeGrade}>
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
            <Form.Item>{loading ? <Loading /> : <SC.btnBlue type="submit">Tạo</SC.btnBlue>}</Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
