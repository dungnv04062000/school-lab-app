import { Col, Form, message, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import * as SC from "../../../common/CustomButton/styled";
import BaseAPI from "../../../../util/BaseAPI.js";
import Loading from "../../../common/loading";
import { useSelector } from "react-redux";
import { semestersSelector } from "../../../../redux/selector";

const { Title } = Typography;
const { Option } = Select;

function CopyLesson({ lesson, onClose }) {
  const [loading, setLoaing] = useState(false);
  const [classId, setClassId] = useState(null);
  const [classes, setClasses] = useState([]);

  const semesters = useSelector(semestersSelector);
  const [semesterId, setSemesterId] = useState(semesters[0]?.id);

  useEffect(() => {
    if (semesterId) {
      let response = BaseAPI.get(`/classes/teacher`, {
        params: {
          semester_id: semesterId
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
    }
  }, [semesterId]);

  const handleSemesterChange = (value) => {
    setSemesterId(value);
  };
  const handleClassChange = (value) => {
    setClassId(value);
  };
  const onSubmit = () => {
    setLoaing(true);
    let response = BaseAPI.post(`/lessons/copy-to-other-class/${classId}/${lesson?.id}`);
    response
      .then((res) => {
        if (res?.status === 201) {
          message.success("Tạo thành công");
          setClassId(null);
          onClose();
        } else {
          message.error(res?.response?.data?.message || "Tạo thất bại");
        }
        setLoaing(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setLoaing(false);
      });
  };
  return (
    <>
      <Form onFinish={onSubmit}>
        <Col span={24}>
          <h4>Học kỳ</h4>
          <Form.Item>
            <Select defaultValue={semesterId} size="large" onChange={handleSemesterChange} placeholder="Chọn học kỳ">
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
        <Col span={24}>
          <h4>Lớp</h4>
          <Form.Item>
            <Select onChange={handleClassChange} size="large" placeholder="Chọn lớp">
              {classes.map((item) => {
                return (
                  <Option key={item?.id} value={item?.id} disabled={item.id === lesson.class_id}>
                    {item?.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        {loading ? <Loading /> : <SC.btnBlue>Thêm</SC.btnBlue>}
      </Form>
    </>
  );
}

export default CopyLesson;
