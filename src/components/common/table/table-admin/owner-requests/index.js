import { Col, Input, Row, Space, Table, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import * as SC from "../../../CustomButton/styled";
import SkeletonApp from "../../../Skeleton";
import * as TimeUtil from "../../../../../util/TimeUtil";
import "./style.scss";
import TextArea from "antd/lib/input/TextArea";
import AppDrawer from "../../../drawer";
import * as Constants from "../../../../../util/Constants";

export default function OwnerRequests({ supports, totalItems, handlePageChange }) {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(null);

  const showDrawer = (item) => {
    setRequest(item);
    setOpen(true);
  };
  const closeDrawer = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 200
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      width: 300
    },
    {
      title: "Phản hồi",
      dataIndex: "response",
      key: "response",
      ellipsis: true
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
      width: 100,
      fixed: "right",
      align: "center",
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
            <Row style={{ marginTop: 15 }}>
              <b>Phản hồi:</b>
            </Row>
            <Row className="support-request">
              <TextArea disabled value={request?.response} />
            </Row>
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
              hideOnSinglePage: true,
              showSizeChanger: false,
              position: ["none", "bottomCenter"]
            }}
          />
        }
      />
    </div>
  );
}
