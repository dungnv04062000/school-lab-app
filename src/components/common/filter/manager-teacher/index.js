import { Col, Form, Row, Select, Input } from "antd";
import React from "react";
import * as SC from "../../CustomButton/styled";

const { Option } = Select;

const onFinish = (values) => {
  console.log("Success1:", values);
};

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

export default function FilterAdManagerTeacher() {
  return (
    <div className="filter-ad-manager-teacher">
      <Form onFinish={onFinish}>
        <Row justify="space-around" align="bottom">
          <Col md={24} lg={10} xl={6}>
            <Form.Item>
              <label>Tên giáo viên</label>
              <Input size="large" placeholder="Tên giáo viên ..." />
            </Form.Item>
          </Col>
          <Col md={24} lg={10} xl={6}>
            <Form.Item>
              <label>Chủ nhiệm</label>
              <Select defaultValue="all" size="large" onChange={handleChange}>
                <Option value="all">Tất cả</Option>
                <Option value="10A1">10A1</Option>
                <Option value="10A1">10A2</Option>
                <Option value="10A1">11A1</Option>
                <Option value="10A1">12A1</Option>
                <Option value="...">...</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={24} lg={10} xl={6}>
            <Form.Item>
              <label>Môn học</label>
              <Select defaultValue="all" size="large" onChange={handleChange}>
                <Option value="all">Tất cả</Option>
                <Option value="scr0001">Khoa học</Option>
                <Option value="tec0001">Công nghệ</Option>
                <Option value="elc0001">Kĩ thuật</Option>
                <Option value="mat0001">Toán học</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={24} lg={10} xl={2}>
            <Form.Item>
              <SC.btnGray>Tìm kiếm</SC.btnGray>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
