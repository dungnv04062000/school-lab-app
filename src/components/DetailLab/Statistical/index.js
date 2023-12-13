import React from "react";
import { Divider, List, Typography } from "antd";
import "./statistical.scss";

const data = [
  {
    title: "Racing car sprays burning fuel into crowd.",
    content: 10
  },
  {
    title: "Japanese princess to wed commoner.",
    content: 10
  },
  {
    title: "Australian walks 100km after outback crash.",
    content: 10
  },
  {
    title: "Man charged over missing wedding girl.",
    content: 10
  },
  {
    title: "Los Angeles battles huge wildfires.",
    content: 10
  }
];

export default function StatisticQuick() {
  return (
    <div className="statistical">
      <Divider orientation="left">Thống kê nhanh</Divider>
      <List
        // bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text>{item.title}</Typography.Text>
            <div>{item.content}</div>
          </List.Item>
        )}
      />
    </div>
  );
}
