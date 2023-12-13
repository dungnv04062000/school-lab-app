import { Form, Input, message } from "antd";
import React, { useEffect } from "react";
import * as SC from "../../CustomButton/styled";
// import "./form-note-student.scss";
import MultipartFormAPI from "../../../../util/MultipartFormDataAPI";
import { useState } from "react";
import Dragger from "antd/lib/upload/Dragger";
import { CloudUploadOutlined } from "@ant-design/icons";
import Loading from "../../loading";

const { TextArea } = Input;

export default function FormEditLibrary({ refresh, onClose, tutorial }) {
  const [title, setTitle] = useState(tutorial?.title);
  const [description, setDescription] = useState(tutorial?.description);

  const [file, setFile] = useState({});
  const [isValidFile, setIsValidFile] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    if (tutorial) {
      setTitle(tutorial.title);
      setDescription(tutorial.description);
    }
  }, [tutorial]);

  const onFinish = () => {
    setLoading(true);
    const response = MultipartFormAPI.patch(`/tutorials/${tutorial?.id}`, {
      title: title?.trim(),
      description: description?.trim(),
      file: file
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Cập nhật tài liệu thành công");
          refresh();
          onClose();
        } else {
          message.error(res?.response?.data?.message || "Cập nhật thất bại");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau");
      });
  };

  const dummyRequest = ({ file, onSuccess, onFailure }) => {
    setTimeout(() => {
      setFile(file);
      onSuccess("ok");
    }, 2000);
  };

  const beforeUpload = (file) => {
    if (file.size > 25000000) {
      setFile({});
      setIsValidFile(false);
      message.error("Kích thước file này đã vượt quá 25MB, không thể tải lên");
      return false;
    } else {
      setIsValidFile(true);
      return true;
    }
  };

  const onRemove = () => {
    setFile({});
    setIsValidFile(true);
  };

  const props = {
    name: "file",
    multiple: false,
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`Tải lên thành công file ${info.file.name}`);
      } else if (status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
    beforeUpload: beforeUpload,
    onRemove: onRemove,
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068"
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`
    }
  };

  return (
    <div className="form-create-library">
      <Form onFinish={onFinish}>
        <label>Tiêu đề</label>
        <Form.Item>
          <Input value={title} onChange={handleChangeTitle} size="large" />
        </Form.Item>
        <label>Mô tả</label>
        <Form.Item>
          <TextArea value={description} onChange={handleChangeDescription} rows={5} />
        </Form.Item>
        <label>Tệp đính kèm</label>
        <Dragger maxCount={1} {...props} style={{ width: "100%" }}>
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <p className="ant-upload-text">Chọn hoặc kéo thả file vào đây để tải lên</p>
          <p className="ant-upload-hint warning">
            Nếu có nhiều hơn 1 tệp cần tải lên, hãy nén tất cả lại nhé
            <br />
            Vui lòng tải lên tệp có kích thước nhỏ hơn 25MB
          </p>
        </Dragger>
        <Form.Item style={{ marginTop: 20 }}>
          {isValidFile ? (
            loading ? (
              <Loading />
            ) : (
              <SC.btnBlue>Đăng tải</SC.btnBlue>
            )
          ) : (
            "Kích thước file này đã vượt quá 25MB, không thể tải lên"
          )}
        </Form.Item>
      </Form>
    </div>
  );
}
