import { Col, Form, Input, message, Row } from "antd";
import React, { useState } from "react";
import * as SC from "../../CustomButton/styled";
import "./form-note-student.scss";
import BaseAPI from "../../../../util/BaseAPI";

const { TextArea } = Input;

export default function FormNoteStudent({ refresh, onClose }) {
  const [textNote, setTextNote] = useState("");

  const handleCreateNote = (e) => {
    setTextNote(e.target.value);
  };

  const onFinish = () => {
    if (textNote?.trim()?.length === 0) {
      message.error("Vui lòng nhập nội dung");
    } else {
      const createNoteRes = BaseAPI.post("/notes", { content: textNote?.trim() });
      createNoteRes
        .then((res) => {
          if (res?.status === 201) {
            message.success("Tạo ghi chú thành công");
            setTextNote(null);
            refresh();
            onClose();
          } else {
            message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          }
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        });
    }
  };
  return (
    <div className="form-note-student">
      <h2>Ghi chép</h2>
      <Form onFinish={onFinish}>
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
          <TextArea onChange={handleCreateNote} rows={15} />
        </Form.Item>
        <Form.Item>
          <SC.btnLightGreen>Lưu</SC.btnLightGreen>
        </Form.Item>
      </Form>
    </div>
  );
}
