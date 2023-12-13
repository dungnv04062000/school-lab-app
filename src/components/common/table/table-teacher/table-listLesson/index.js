import { Table, Space, Tooltip, Tag } from "antd";
import * as TimeUtil from "../../../../../util/TimeUtil";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as SC from "../../../CustomButton/styled";
import * as Constants from "../../../../../util/Constants";
import SkeletonApp from "../../../Skeleton";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

export default function TableTeacherListLesson({ lessons, totalItems, currentPage, onPageChange }) {
  const navigate = useNavigate();
  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "no",
      width: 50,
      align: "center",
      render: (value, option, index) => {
        return index + (currentPage - 1) * Constants.LESSONS_TABLE_ROW_NUMBER + 1;
      }
    },
    {
      title: "Dự án",
      dataIndex: "title",
      ellipsis: true,
      key: "title"
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "create_at",
      key: "createAt",
      width: 140,
      render: (value) => {
        return TimeUtil.convertUTCtoDate(value);
      }
    },
    {
      title: "Hạn nộp bài",
      dataIndex: "end_at",
      key: "endAt",
      width: 150,
      render: (value) => {
        return value && TimeUtil.convertUTCtoDatetime(value);
      }
    },
    {
      title: "Mức độ",
      dataIndex: "level_name",
      width: 110,
      key: "level",
      align: "center",
      render: (value, item, index) => {
        if (item?.level_id === 1) {
          return <Tag color="#87d068">{value}</Tag>;
        } else if (item?.level_id === 2) {
          return <Tag color="#108ee9">{value}</Tag>;
        } else if (item?.level_id === 3) {
          return <Tag color="#f50">{value}</Tag>;
        }
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      filters: [
        {
          text: "Đang diễn ra",
          value: "ONGOING"
        },
        {
          text: "Đã kết thúc",
          value: "FINISHED"
        }
      ],
      onFilter: (value, record) => record.status.startsWith(value),
      render: (value) => {
        if (value === "ONGOING") {
          return <Tag color="blue">Đang diễn ra</Tag>;
        } else {
          return <Tag color="green">Đã kết thúc</Tag>;
        }
      }
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 160,
      align: "center",
      key: "action",
      fixed: "right",
      render: (value, item, index) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <SC.btnLightGreen onClick={() => navigate(`/teacher/lessons/detail?lessonId=${item.id}`)}>
              <EyeOutlined />
            </SC.btnLightGreen>
          </Tooltip>
          {item?.status === "FINISHED" ? (
            <Tooltip title="Dự án đã kết thúc">
              <SC.btnDisable disabled onClick={() => navigate(`/teacher/lessons/edit?lessonId=${item?.id}`)}>
                <EditOutlined />
              </SC.btnDisable>
            </Tooltip>
          ) : (
            <Tooltip title="Chỉnh sửa">
              <SC.btnBlue onClick={() => navigate(`/teacher/lessons/edit?lessonId=${item?.id}`)}>
                <EditOutlined />
              </SC.btnBlue>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];
  return (
    <>
      <SkeletonApp
        content={
          <Table
            rowKey={"id"}
            size="small"
            dataSource={lessons}
            columns={columns}
            style={{ minHeight: 700 }}
            bordered="true"
            scroll={{
              x: 1100
            }}
            pagination={{
              defaultPageSize: Constants.LESSONS_TABLE_ROW_NUMBER,
              defaultCurrent: currentPage,
              total: totalItems,
              onChange: onPageChange,
              hideOnSinglePage: true,
              showSizeChanger: false,
              position: ["none", "bottomCenter"]
            }}
          />
        }
      />
    </>
  );
}
