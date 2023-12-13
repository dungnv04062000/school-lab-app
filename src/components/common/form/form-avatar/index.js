import { Button, Col, Image, message, Modal, Row, Upload } from "antd";
import React, { useState } from "react";
import "./form-avatar.scss";
import * as S3 from "../../../../util/S3Host";
import MultipartAPI from "../../../../util/MultipartFormDataAPI";
import Loading from "../../loading";

export default function FormAvatar({ user }) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleChangeAvatar = () => {
    setLoading(true);
    let response = MultipartAPI.post(`/users/change-avatar`, {
      file: file
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Cập nhật thành công");
        } else {
          message.success(res?.response?.data?.message || "Cập nhật thất bại");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.success(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const handleSetDefaultAvatar = () => {
    setLoading(true);
    let response = MultipartAPI.post(`/users/set-default-avatar`);

    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Cập nhật thành công");
          handleCancel();
        } else {
          message.success(res?.response?.data?.message || "Cập nhật thất bại");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.success(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const dummyRequest = ({ file, onSuccess, onFailure }) => {
    setTimeout(() => {
      setFile(file);
      onSuccess("ok");
    }, 2000);
  };

  const [isValid, setIsValid] = useState(false);
  const beforeUpload = (file) => {
    setIsValid(true);
    if (!file?.name.endsWith(".png") && !file?.name.endsWith(".jpg") && !file?.name.endsWith(".jpge")) {
      message.error("Sai định dạng");
      setIsValid(false);
      return false;
    }
    if (file.size > 25000000) {
      setFile(null);
      message.error("Kích thước file này đã vượt quá 25MB, không thể tải lên");
      setIsValid(false);
      return false;
    } else {
      return true;
    }
  };

  const onRemove = () => {
    setFile(null);
  };

  const props = {
    name: "file",
    accept: ".png, .jpg, .jpge",
    multiple: false,
    customRequest: dummyRequest,
    headers: {
      authorization: "authorization-text"
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
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`Tải lên thành công file ${info.file.name}`);
      } else if (status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    }
  };

  //default
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    handleSetDefaultAvatar();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="avatar-form">
      <Row gutter={[10, 30]} justify="center">
        <Col span={24}>
          <h2>Ảnh đại diện</h2>
        </Col>
        <Col span={24}>
          <Image
            style={{
              width: "100%",
              maxWidth: 300,
              maxHeight: 400,
              objectFit: "fill",
              objectPosition: "center"
            }}
            src={`${S3.HOST}${user.image_url}`}
            alt="avatar"
          />
        </Col>
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Upload {...props} maxCount={1} listType="picture">
              <Button>Đổi ảnh đại diện</Button>
            </Upload>
            {file &&
              (loading ? (
                <Loading />
              ) : (
                isValid && (
                  <Button type="primary" style={{ marginTop: 20 }} onClick={handleChangeAvatar}>
                    Lưu
                  </Button>
                )
              ))}
          </Col>
          <Col span={24}>
            <Button style={{ marginTop: 20 }} onClick={showModal}>
              Đặt ảnh mặc định
            </Button>

            <Modal title="Xác nhận" open={open} onOk={handleOk} confirmLoading={loading} onCancel={handleCancel}>
              <div>Bạn chắc chắn muốn sử dụng ảnh đại diện mặc định?</div>
            </Modal>
          </Col>
        </Row>
      </Row>
    </div>
  );
}
