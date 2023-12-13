import { Table, Space, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import * as SC from "../../../CustomButton/styled";
import React from "react";
import SkeletonApp from "../../../Skeleton";
import "./table-listStudent.scss";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    width: 150
  },
  {
    title: "Mã học sinh",
    dataIndex: "number",
    width: 150
  },
  {
    title: "Tên",
    dataIndex: "name",
    width: 150
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    width: 150
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 150
  },
  {
    title: "Hành động",
    dataIndex: "action",
    width: 150,
    render: () => (
      <Space size="middle">
        <Tooltip title="Chi tiết">
          <SC.btnLightGreen>
            <EyeOutlined />
          </SC.btnLightGreen>
        </Tooltip>
      </Space>
    )
  }
];
const data = [];

for (let i = 0; i < 30; i++) {
  data.push({
    key: i,
    stt: i + 1,
    number: `HS000${i + 1}`,
    name: `Edward King ${i}`,
    gender: "male",
    email: `abc${i}@gmail.com`
  });
}

export default function TableListStudent() {
  return (
    <SkeletonApp
      content={
        <Table
          size="small"
          columns={columns}
          dataSource={data}
          bordered="true"
          scroll={{
            x: 700
          }}
          pagination={{
            hideOnSinglePage: true,
            showSizeChanger: false,
            position: ["none", "bottomCenter"]
          }}
        />
      }
    />
  );
}
