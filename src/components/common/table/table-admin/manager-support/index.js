import { Col, Form, Input, message, Popconfirm, Row, Space, Table, Tag, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import { EyeOutlined, CheckOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import * as SC from "../../../CustomButton/styled";
import SkeletonApp from "../../../Skeleton";
import * as TimeUtil from "../../../../../util/TimeUtil";
import "./style.scss";
import TextArea from "antd/lib/input/TextArea";
import BaseAPI from "../../../../../util/BaseAPI";
import Loading from "../../../loading";
import AppDrawer from "../../../drawer";
import * as Constants from "../../../../../util/Constants";

const { Title } = Typography;

export default function TableAdListSupport({ supports, totalItems, handlePageChange, refresh }) {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const showDrawer = (item) => {
    setResponse(item?.response ? item.response : null);
    setRequest(item);
    setOpen(true);
  };
  const closeDrawer = () => {
    setOpen(false);
  };

  const handleReponseChange = (e) => {
    setResponse(e.target.value);
  };

  const sendReponse = (guest) => {
    setLoading(true);
    console.log(guest);
    let _response = BaseAPI.patch(`/supports/${request?.id}`, {
      response: guest ? null : response
    });
    _response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Cập nhật thành công");
          if (refresh) {
            refresh();
          }
          closeDrawer();
        } else {
          message.error(res?.response?.data?.message || "Cập nhật thất bại");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "from_id",
      key: "id",
      width: 100,
      fixed: "left",
      render: (value) => <b>{value ? value : "Khách"}</b>
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "left"
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phoneNumber",
      width: 130
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 300
    },
    {
      title: "Ngày gửi",
      dataIndex: "create_at",
      key: "createAt",
      width: 140,
      render: (value) => {
        return TimeUtil.convertUTCtoDatetime(value);
      }
    },
    {
      title: "Mức độ",
      dataIndex: "priority",
      key: "priority",
      width: 130,
      align: "center",
      filters: [
        {
          text: "Thấp",
          value: "LOW"
        },
        {
          text: "Trung bình",
          value: "MEDIUM"
        },
        {
          text: "Nghiêm trọng",
          value: "HIGH"
        }
      ],
      onFilter: (value, record) => record.priority.startsWith(value),
      render: (value) => (
        <Space size="small">
          <Tag color={value === "LOW" ? "blue" : value === "MEDIUM" ? "orange" : "red"}>
            <b>{value === "LOW" ? "Thấp" : value === "MEDIUM" ? "Trung bình" : "Nghiêm trọng"}</b>
          </Tag>
        </Space>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      fixed: "right",
      align: "center",
      filters: [
        {
          text: "Chưa xử lý",
          value: "WAITTING"
        },
        {
          text: "Đã xử lý",
          value: "DONE"
        }
      ],
      onFilter: (value, record) => record.status.startsWith(value),
      render: (value) => (
        <Space size="small">
          <Tag color={value === "WAITTING" ? "#adadad" : "#00ff00"}>
            <b>{value === "WAITTING" ? "Chờ xử lý" : "Đã xử lý"}</b>
          </Tag>
        </Space>
      )
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 130,
      align: "center",
      fixed: "right",
      render: (value, item, index) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <SC.btnLightGreen onClick={() => showDrawer(item)}>
              <EyeOutlined />
            </SC.btnLightGreen>
          </Tooltip>

          {item?.status === "WAITTING" ? (
            item?.from_id ? (
              <Tooltip title="Phản hồi">
                <SC.btnBlue onClick={() => showDrawer(item)}>
                  <CheckOutlined />
                </SC.btnBlue>
              </Tooltip>
            ) : (
              <Popconfirm
                title="Đã xử lý xong yêu cầu này?"
                onConfirm={() => {
                  setRequest(item);
                  sendReponse(true);
                }}
                placement="topRight"
                okText="Cập nhật"
                cancelText="Hủy bỏ"
                icon={
                  <QuestionCircleOutlined
                    style={{
                      color: "green"
                    }}
                  />
                }
              >
                <Tooltip title="Cập nhật trạng thái">
                  <SC.btnBlue>
                    <CheckOutlined />
                  </SC.btnBlue>
                </Tooltip>
              </Popconfirm>
            )
          ) : (
            <Tooltip title="Yêu cầu đã được xử lý">
              <SC.btnDisable>
                <CheckOutlined />
              </SC.btnDisable>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];
  return (
    <div>
      <AppDrawer
        title={`Yêu cầu #${request?.id}`}
        open={open}
        onClose={closeDrawer}
        content={
          <div className="support-detail-wrapper">
            <Row justify="start" align="bottom">
              <Col span={6}>
                <label>ID:</label>
              </Col>
              <Col>
                <strong>{request?.from_id ? request.from_id : "Khách"}</strong>
              </Col>
            </Row>
            <Row justify="start" align="bottom">
              <Col span={6}>
                <label>Họ tên:</label>
              </Col>
              <Col>
                <strong>{request?.name}</strong>
              </Col>
            </Row>
            <Row justify="start" align="bottom">
              <Col span={6}>
                <label>Số điện thoại:</label>
              </Col>
              <Col>
                <strong>{request?.phone_number}</strong>
              </Col>
            </Row>
            <Row justify="start" align="bottom">
              <Col span={6}>
                <label>Email:</label>
              </Col>
              <Col>
                <strong>{request?.email}</strong>
              </Col>
            </Row>
            <Row justify="start" align="bottom">
              <Col span={6}>
                <label>Mức độ:</label>
              </Col>
              <Col>
                <Tag color={request?.priority === "LOW" ? "blue" : request?.priority === "MEDIUM" ? "orange" : "red"}>
                  <b>
                    {request?.priority === "LOW"
                      ? "Thấp"
                      : request?.priority === "MEDIUM"
                      ? "Trung bình"
                      : "Nghiêm trọng"}
                  </b>
                </Tag>
              </Col>
            </Row>
            <Row style={{ marginTop: 15 }} justify="start" align="bottom">
              <Col span={6}>
                <label>Trạng thái:</label>
              </Col>
              <Col>
                <Tag color={request?.status === "WAITTING" ? "#adadad" : "#00ff00"}>
                  <b>{request?.status === "WAITTING" ? "Chờ xử lý" : "Đã xử lý"}</b>
                </Tag>
              </Col>
            </Row>
            <Row style={{ marginTop: 15 }}>
              <label>Tiêu đề:</label>
            </Row>
            <Row className="support-request">
              <Input disabled value={request?.title} />
            </Row>
            <Row style={{ marginTop: 15 }}>
              <label>Nội dung:</label>
            </Row>
            <Row className="support-request">
              <TextArea disabled value={request?.content} />
            </Row>
            {request?.from_id ? (
              <Form onFinish={() => sendReponse(false)}>
                <Col style={{ marginTop: 15 }}>
                  <label>Phản hồi:</label>
                  <Form.Item>
                    <TextArea rows={5} onChange={handleReponseChange} value={response} />
                  </Form.Item>
                </Col>
                <Row style={{ marginTop: 15 }}>
                  {loading ? (
                    <Loading />
                  ) : (
                    <SC.btnBlue>{request?.status === "WAITTING" ? "Phản hồi" : "Cập nhật"}</SC.btnBlue>
                  )}
                </Row>
              </Form>
            ) : (
              request?.status === "WAITTING" && (
                <Row style={{ marginTop: 15 }}>{loading ? <Loading /> : <SC.btnBlue>Cập nhật</SC.btnBlue>}</Row>
              )
            )}
          </div>
        }
      />
      <SkeletonApp
        content={
          <Table
            rowKey={"id"}
            size="small"
            dataSource={supports}
            columns={columns}
            style={{ minHeight: 700 }}
            bordered="true"
            scroll={{
              x: 1100
            }}
            pagination={{
              onChange: handlePageChange,
              total: totalItems,
              defaultCurrent: 1,
              defaultPageSize: Constants.SUPPORT_TABLE_ROW_NUMBER,
              showSizeChanger: false,
              hideOnSinglePage: true,
              position: ["none", "bottomCenter"]
            }}
          />
        }
      />
    </div>
  );
}
