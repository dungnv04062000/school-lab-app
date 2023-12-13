import { Table, Space, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import * as SC from "../../../CustomButton/styled";
import React from "react";
import SkeletonApp from "../../../Skeleton";
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
    dataIndex: "name"
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    width: 150
  },
  {
    title: "Toán",
    dataIndex: "math",
    sorter: {
      compare: (a, b) => a.math - b.math,
      multiple: 3
    }
  },
  {
    title: "Lí",
    dataIndex: "physics",
    sorter: {
      compare: (a, b) => a.physics - b.physics,
      multiple: 2
    }
  },
  {
    title: "Hóa",
    dataIndex: "chemistry",
    sorter: {
      compare: (a, b) => a.chemistry - b.chemistry,
      multiple: 1
    }
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
    gender: i % 2 == 0 ? "male" : "female",
    math: Math.floor(Math.random() * (100 - 50) + 50),
    physics: Math.floor(Math.random() * (100 - 50) + 50),
    chemistry: Math.floor(Math.random() * (100 - 50) + 50),
    email: `abc${i}@gmail.com`
  });
}

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

export default function TableRankingStudent() {
  return (
    <SkeletonApp
      content={
        <Table
          size="small"
          columns={columns}
          dataSource={data}
          onChange={onChange}
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
