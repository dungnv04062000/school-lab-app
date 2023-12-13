import React from "react";
import "../loginForm.scss";
import { LockOutlined } from "@ant-design/icons";
import { Form, Input, message, Row, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as SC from "../../../../../components/common/CustomButton/styled";
import BaseAPI from "../../../../../util/BaseAPI";
import { useState } from "react";

export default function ResetPassword() {
  const { Title } = Typography;
  const queryString = useLocation().search;
  const userId = new URLSearchParams(queryString).get("userId");

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const navigate = useNavigate();

  document.title = "Đặt lại mật khẩu";

  const submit = () => {
    if (newPass !== confirmPass) {
      message.error("Mật khẩu không khớp, vui lòng nhập lại");
    } else {
      let response = BaseAPI.post(`/auth/reset-password/${userId}`, {
        password: newPass
      });
      response
        .then((res) => {
          if (res?.status === 200) {
            message.success("Đặt lại mật khẩu thành công");
            navigate("/signin");
          } else {
            message.success(res?.response?.data?.message || "Có lỗi xảy ra");
          }
        })
        .catch((err) => {
          message.success(err?.response?.data?.message || "Có lỗi xảy ra");
        });
    }
  };

  const handleChangeNewPass = (e) => {
    setNewPass(e.target.value);
  };
  const handleChangeConfirmPass = (e) => {
    setConfirmPass(e.target.value);
  };

  return (
    <div className="signin">
      <div className="signin__form">
        <Row className="signin__form-container">
          <Title className="signin__form-title" level={2}>
            Đặt lại mật khẩu
          </Title>
        </Row>
        <Row className="signin__form-data">
          <Form name="normal_login" initialValues={{ remember: true }} className="form-data" onFinish={submit}>
            <label htmlFor="password">Mật khẩu mới</label>
            <Form.Item
              name="password"
              rules={[
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 kí tự"
                },
                {
                  required: true,
                  message: "Vui lòng kiểm tra lại mật khẩu!"
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                value={newPass}
                onChange={handleChangeNewPass}
                size="large"
              />
            </Form.Item>
            <label htmlFor="password-again">Nhập lại mật khẩu</label>
            <Form.Item
              name="rePassword"
              rules={[
                {
                  required: true,
                  message: "Vui lòng kiểm tra lại mật khẩu!"
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                value={confirmPass}
                onChange={handleChangeConfirmPass}
                size="large"
              />
            </Form.Item>
            <Form.Item className="button-form">
              <SC.btnBlue className="login-form-button">Xác nhận</SC.btnBlue>
            </Form.Item>
            <SC.btnGray className="login-form-button" onClick={() => navigate("/signin")}>
              Quay lại
            </SC.btnGray>
          </Form>
        </Row>
      </div>
    </div>
  );
}
