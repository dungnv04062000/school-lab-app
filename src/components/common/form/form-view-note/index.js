import { Col, Form, Input, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import * as SC from "../../CustomButton/styled";
import "./form-view-note-student.scss";
import BaseAPI from "../../../../util/BaseAPI";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

export default function FormViewNote({ lessonId, currentNote, refresh, onClose }) {
  const [note, setNote] = useState(currentNote);
  const [content, setContent] = useState(currentNote?.content || null);

  useEffect(() => {
    setNote(currentNote);
    setContent(currentNote?.content || null);
  }, [currentNote]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    if (!currentNote) {
      getNote();
    }
  }, []);

  const getNote = () => {
    let response = BaseAPI.get(`/notes/lesson/${lessonId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setNote(res.data.item);
          setContent(res.data.item.content);
        } else {
          setNote(null);
          setContent(null);
        }
      })
      .catch((err) => {
        setNote(null);
        setContent(null);
      });
  };

  const onCreate = () => {
    if (content?.trim()?.length === 0) {
      message.error("Vui lòng nhập nội dung");
    } else {
      let response = BaseAPI.post(`/notes`, {
        lesson_id: lessonId ? lessonId : null,
        content: content
      });

      response
        .then((res) => {
          if (res?.status === 201) {
            message.success("Tạo ghi chú thành công");
            if (refresh) {
              refresh();
            }
            getNote();
          } else {
            message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          }
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        });
    }
  };

  const onSave = () => {
    let response = BaseAPI.patch(`/notes/${note.id}`, {
      lesson_id: note.lesson_id,
      content: content
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Cập nhật thành công");
          if (refresh) {
            refresh();
          }
          onClose();
        } else {
          message.error(res?.response?.data?.message || "Cập nhật thất bại");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const navigate = useNavigate();

  return (
    <div className="form-view-note-student">
      <h2>Ghi chú</h2>
      <Form onFinish={note ? onSave : onCreate}>
        <label>Nội dung</label>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng nhập nội dung"
            }
          ]}
        >
          <TextArea rows={10} onChange={handleContentChange} value={content} />
        </Form.Item>
        {note ? (
          <></>
        ) : (
          <Row style={{ color: "red", fontStyle: "italic" }}>
            Để sử dụng chức năng ghi nhật ký thí nghiệm, hãy tạo ghi chú trước
          </Row>
        )}
        <Row gutter={[10, 10]} justify="start" align="middle">
          <Col>
            <Form.Item>
              <SC.btnLightGreen>{note ? "Sửa" : "Tạo mới"}</SC.btnLightGreen>
            </Form.Item>
          </Col>
          {note && (
            <Col>
              <Form.Item>
                <SC.btnBlue onClick={() => navigate(`/notes/detail?noteId=${note?.id}`)}>Nhật ký</SC.btnBlue>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
}
