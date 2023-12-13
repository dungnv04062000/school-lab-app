import React, { useState } from "react";
import "../loginForm.scss";
import { UserOutlined } from "@ant-design/icons";
import { Col, Form, Input, message, Row, Typography } from "antd";
import * as SC from "../../../../../components/common/CustomButton/styled";
import BaseAPI from "../../../../../util/BaseAPI";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../components/common/loading";

export default function Forgotpassword() {
  const { Title } = Typography;
  const [emailText, setEmailText] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);
    let response = BaseAPI.post("auth/forgot-password", { email: emailText });
    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Đã gửi xác thực. Vui lòng kiểm tra email của bạn");
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
        setLoading(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setLoading(false);
      });
  };

  const navigate = useNavigate();

  return (
    <div className="signin">
      <div className="signin__form">
        <Row className="signin__form-container">
          <Title className="signin__form-title" level={2}>
            Quên mật khẩu
          </Title>
        </Row>
        <Row>Hãy nhập email của bạn để đặt lại mật khẩu</Row>
        <Form name="normal_email" className="form-data" onFinish={onSubmit}>
          <Row className="signin__form-data" justify="space-around">
            <Col span={18}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Email không hợp lệ"
                  },
                  {
                    required: true,
                    message: "Vui lòng nhập Email đăng ký"
                  }
                ]}
              >
                <Input
                  type="text"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                  size="large"
                  // value={emailText}
                  onChange={(e) => setEmailText(e.target.value.trim())}
                />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Row justify="space-between" align="top">
                <Col>
                  <SC.btnGray onClick={() => navigate(-1)}>Quay lại</SC.btnGray>
                </Col>
                <Col>
                  {loading ? (
                    <Loading />
                  ) : (
                    <Form.Item>
                      <SC.btnWhite size={"large"} loading={loading}>
                        Gửi yêu cầu
                      </SC.btnWhite>
                    </Form.Item>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
