import { Row, Col, Input, Form } from "antd";
import React from "react";
import "./filter-student.scss";
import * as SC from "../../../../../styles/common/styled";
const onFinish = (values) => {
  console.log("Success:", values);
};

export default function FilterSubjectStudent() {
  return (
    <div className="filter-student">
      <Form onFinish={onFinish}>
        <Row gutter={[24, 24]} justify="space-around" align="bottom">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item>
              <p>Tên Môn Học</p>
              <Input placeholder="Môn Học ..." size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item>
              <p>Tên giáo viên</p>
              <Input placeholder="Giáo viên ..." size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} className="group-btn">
            <Form.Item>
              <SC.btnWhite>Tìm kiếm</SC.btnWhite>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
