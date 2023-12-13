import { Button, Form, Input, message, Modal, Row } from "antd";
import React, { useState } from "react";
import "./changePassword.scss";
import BaseAPI from "../../../util/BaseAPI";
import { useForm } from "antd/lib/form/Form";

export default function ChangePasswordModal(props) {
  const { openModal, handleCancel } = props;

  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [rePassword, setRePassword] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  };

  const [form] = useForm();

  const onFinish = () => {
    if (newPassword !== rePassword) {
      message.error("Nhập mật khẩu mới không khớp");
    } else {
      setLoading(true);
      let response = BaseAPI.post(`/auth/change-password`, {
        current_password: currentPassword?.trim(),
        new_password: newPassword?.trim()
      });
      response
        .then((res) => {
          if (res?.status === 200) {
            message.success("Đổi mật khẩu thành công");
            form.setFieldsValue({
              currentPassword: null,
              newPassword: null,
              rePassword: null
            });
            handleCancel();
          } else {
            message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          }
          setLoading(false);
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
          setLoading(false);
        });
    }
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      open={openModal}
      onCancel={handleCancel}
      footer={[
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} form="change-password">
            Đổi mật khẩu
          </Button>
        </Form.Item>
      ]}
    >
      <Form form={form} onFinish={onFinish} id="change-password">
        <label>Mật khẩu hiện tại</label>
        <Form.Item
          name="currentPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu hiện tại"
            }
          ]}
        >
          <Input.Password size="large" onChange={handleCurrentPasswordChange} />
        </Form.Item>

        <label>Mật khẩu mới</label>
        <Form.Item
          name="newPassword"
          rules={[
            {
              min: 6,
              message: "Mật khẩu phải có ít nhất 6 kí tự"
            },
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới"
            }
          ]}
        >
          <Input.Password size="large" onChange={handleNewPasswordChange} />
        </Form.Item>
        <label>Nhập lại mật khẩu mới</label>
        <Form.Item
          name="rePassword"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập lại mật khẩu mới"
            }
          ]}
        >
          <Input.Password size="large" onChange={handleRePasswordChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
