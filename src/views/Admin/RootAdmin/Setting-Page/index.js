import { Col, Form, Input, Row, Typography, Select } from "antd";
import React from "react";
import "./admin-setting-page.scss";
import LayoutHomeList from "../../../../components/layouts/mainLayout";
import * as SC from "../../../../components/common/CustomButton/styled";
const { Option } = Select;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

export default function AdminSettingPage() {
  return (
    <LayoutHomeList
      content={
        <div className="admin-setting-page">
          <Typography.Title>Cài đặt trang</Typography.Title>
          <Form>
            <Row justify="space-around" className="setting-content">
              <Col span={10} className="setting-contact">
                <Row>
                  <Col span={5}>Email</Col>
                  <Col span={15}>
                    <Form.Item>
                      <Input value="schoollab@gmail.com" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>Số điện thoại</Col>
                  <Col span={15}>
                    <Form.Item>
                      <Input value="0834738483" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>Mạng xã hội</Col>
                  <Col span={15}>
                    <Form.Item>
                      <Input value="link fb or insta ..." />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={10} className="setting-address">
                <Row>
                  <Col span={5}>Tỉnh/Thành Phố</Col>
                  <Col span={15}>
                    <Form.Item>
                      <Select defaultValue="lucy" onChange={handleChange}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Hà Nội</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>Quận/huyện</Col>
                  <Col span={15}>
                    <Form.Item>
                      <Select defaultValue="lucy">
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Thạch Thất</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>Phường/xã</Col>
                  <Col span={15}>
                    <Form.Item>
                      <Select defaultValue="lucy" onChange={handleChange}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Hòa Lạc</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>Địa chỉ</Col>
                  <Col span={15}>
                    <Form.Item>
                      <Input value="Đại học FPT, km29 đại lộ Thăng Long" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row justify="end" style={{ margin: "5%" }}>
              <Col span={3}>
                <SC.btnGray>Quay lại</SC.btnGray>
              </Col>
              <Col span={3}>
                <Form.Item>
                  <SC.btnLightGreen>Lưu</SC.btnLightGreen>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      }
    />
  );
}
