import { Col, Form, Input, message, Row, Select, Tag } from "antd";
import { useForm } from "antd/lib/form/Form";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as SC from "../../CustomButton/styled";
import Loading from "../../loading";
import BaseAPI from "../../../../util/BaseAPI";

const { TextArea } = Input;
const { Option } = Select;

export default function FormSupport({ onClickOk, onCancel, user }) {
  const [name, setName] = useState(user ? user.first_name + " " + user.last_name : null);
  const [phone, setPhone] = useState(user?.phone_number);
  const [email, setEmail] = useState(user?.email);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [priority, setPriority] = useState("LOW");

  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  const [form] = useForm();
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.first_name + " " + user.last_name,
        phone: user.phone_number,
        email: user.email
      });
    }
  }, []);

  const sendRequest = () => {
    setLoading(true);
    let response = BaseAPI.post(`/supports`, {
      from_id: user?.id,
      name: name?.trim(),
      phone_number: phone,
      email: email,
      title: title?.trim(),
      content: content?.trim(),
      priority: priority
    });
    response
      .then((res) => {
        if (res?.status === 201) {
          message.success("Gửi yêu cầu thành công");
          form.resetFields();
          if (onCancel) {
            onCancel();
          }
        } else {
          message.error(res?.response?.data?.message || "Gửi yêu cầu thất bại");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err?.response?.data?.message || "Gửi yêu cầu thất bại");
      });
  };

  return (
    <div>
      <Form form={form} onFinish={sendRequest}>
        <label>Họ và tên</label>
        <Form.Item
          name={"name"}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập họ tên"
            }
          ]}
        >
          <Input size="large" onChange={handleNameChange} />
        </Form.Item>
        <label>Số điện thoại</label>
        <Form.Item
          name={"phone"}
          rules={[
            {
              required: true,
              pattern: new RegExp(/^(84|0[1-9])+(([0-9]{8}|([0-9]){7}))$/),
              message: "Số điện thoại không hợp lệ"
            }
          ]}
        >
          <Input size="large" onChange={handlePhoneChange} />
        </Form.Item>
        <label>Email</label>
        <Form.Item
          name={"email"}
          rules={[
            {
              type: "email",
              message: "Email không hợp lệ"
            },
            {
              required: true,
              message: "Vui lòng nhập Email"
            }
          ]}
        >
          <Input size="large" onChange={handleEmailChange} />
        </Form.Item>
        <label>Tiêu đề</label>
        <Form.Item
          name={"title"}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tiêu đề"
            }
          ]}
        >
          <Input type="text" size="large" onChange={handleTitleChange} />
        </Form.Item>
        <label>Nội dung</label>
        <Form.Item
          name={"content"}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập nội dung"
            }
          ]}
        >
          <TextArea rows={7} onChange={handleContentChange} />
        </Form.Item>
        <label>Mức độ</label>
        <Form.Item>
          <Select defaultValue="LOW" size="large" onChange={handlePriorityChange}>
            <Option value="LOW">
              <Tag color="blue">Thấp</Tag>
            </Option>
            <Option value="MEDIUM">
              <Tag color="orange">Trung bình</Tag>
            </Option>
            <Option value="HIGH">
              <Tag color="red">Nghiêm trọng</Tag>
            </Option>
          </Select>
        </Form.Item>
        <Row justify="end">
          <Col>
            <Form.Item>{loading ? <Loading /> : <SC.btnBlue onClick={onClickOk}>Gửi yêu cầu</SC.btnBlue>}</Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
