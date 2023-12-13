import { Button, Col, Form, Input, Row, Select } from "antd";
import React from "react";
import "./homeroom-teacher.scss";
import * as SC from "../../CustomButton/styled";
const { Option } = Select;

const onFinish = (values) => {
  console.log("Success:", values);
};

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

export default function FilterHomeroomTeacher() {
  return (
    <div className="filter-option">
      <Form onFinish={onFinish}>
        <Row gutter={[24, 24]} justify="space-around" align="bottom">
          <Col xs={23} sm={11} md={7} lg={5}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên"
                }
              ]}
            >
              <label>Tên</label>
              <Input size="large" placeholder="Tên học sinh ..." />
            </Form.Item>
          </Col>
          <Col xs={23} sm={11} md={7} lg={4}>
            <Form.Item>
              <label>Giới tính</label>
              <Select size="large" id="gender" onChange={handleChange} defaultValue="male">
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={23} sm={11} md={7} lg={4}>
            <Form.Item>
              <label>Môn</label>
              <Select size="large" defaultValue="sic111" onChange={handleChange}>
                <Option value="sic111">Khoa Học - sic111</Option>
                <Option value="tec112">Công Nghệ - tec112</Option>
                <Option value="tec112">Kỹ Thuật - tec112</Option>
                <Option value="mat114">Toán Học - mat114</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={23} sm={11} md={7} lg={4}>
            <Form.Item>
              <label>Thời gian</label>
              <Select size="large" defaultValue="new" onChange={handleChange}>
                <Option value="new">Mới nhất</Option>
                <Option value="old">Cũ nhất</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={23} sm={11} md={7} lg={3} className="group-btn">
            <Form.Item>
              <SC.btnWhite className="btn-filter">Tìm kiếm</SC.btnWhite>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
