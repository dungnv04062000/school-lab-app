import { Select, Row, Col, DatePicker, Form, Input, Button } from "antd";
import React from "react";
import * as SC from "../../../CustomButton/styled";
const { Option } = Select;
const { RangePicker } = DatePicker;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const onFinish = (values) => {
  console.log("Success:", values);
};

export default function FilterActivityStatistic() {
  return (
    <div className="filter-activity-statistics">
      <Form onFinish={onFinish}>
        <Row gutter={[24, 24]} justify="space-around" align="bottom">
          <Col span={6}>
            <Form.Item>
              <label>Tên lớp</label>
              <Select defaultValue="000vl10" size="large" onChange={handleChange}>
                <Option value="000vl10">Vật Lí 10 - 000VL10</Option>
                <Option value="000hh10">Hóa Học 10 - 000HH10</Option>
                <Option value="000kh10">Khoa Học 10 - 000KH10</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
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
          <Col span={6}>
            <Form.Item
              name="time"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn khoảng thời gian"
                }
              ]}
            >
              <p>Thời gian</p>
              <RangePicker showTime size="large" />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item>
              <SC.btnGray>Tìm kiếm</SC.btnGray>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
