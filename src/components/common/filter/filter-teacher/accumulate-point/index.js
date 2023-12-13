import { Col, Form, Row, Select, Input } from "antd";
import React from "react";
import * as SC from "../../../CustomButton/styled";
const { Option } = Select;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const onFinish = (values) => {
  console.log("Success:", values);
};

export default function FilterTeacherAccumulatedPoint() {
  return (
    <div className="filter-activity-statistics">
      <Form onFinish={onFinish}>
        <Row gutter={[24, 24]} justify="space-around" align="bottom">
          <Col xs={23} sm={11} md={7} lg={5}>
            <Form.Item>
              <label>Môn học</label>
              <Select defaultValue="000vl10" size="large" onChange={handleChange}>
                <Option value="000vl10">Vật Lí 10 - 000VL10</Option>
                <Option value="000hh10">Hóa Học 10 - 000HH10</Option>
                <Option value="000kh10">Khoa Học 10 - 000KH10</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={23} sm={11} md={7} lg={5}>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên học sinh"
                }
              ]}
            >
              <label>Tên học sinh</label>
              <Input size="large" placeholder="Tên học sinh ..." />
            </Form.Item>
          </Col>

          <Col xs={23} sm={11} md={7} lg={5}>
            <Form.Item>
              <SC.btnGray>Tìm kiếm</SC.btnGray>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
