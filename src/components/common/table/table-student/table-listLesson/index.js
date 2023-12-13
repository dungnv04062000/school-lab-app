import { Table, Space, Tooltip, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import * as SC from "../../../CustomButton/styled";
import * as Constants from "../../../../../util/Constants";
import SkeletonApp from "../../../Skeleton";
import * as TimeUtil from "../../../../../util/TimeUtil";

export default function TableStudentListLesson({ lessons, totalItems, currentPage, onPageChange }) {
  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "no",
      width: 50,
      align: "center",
      render: (value, option, index) => {
        return Constants.LESSONS_TABLE_ROW_NUMBER * (currentPage - 1) + index + 1;
      }
    },
    {
      title: "Lớp",
      dataIndex: "class_name",
      key: "className",
      width: 100
    },
    {
      title: "Dự án",
      dataIndex: "title",
      ellipsis: true,
      key: "title"
    },

    {
      title: "Người tạo",
      dataIndex: "create_by_full_name",
      key: "createByFullName",
      width: 170
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "create_at",
      key: "createAt",
      width: 130,
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
      key: "level",
      width: 100,
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
      width: 110,
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
      key: "action",
      width: 100,
      align: "center",
      fixed: "right",
      render: (value, item, index) => {
        return (
          <Space size="small">
            {
              <Link to={`/student/lessons/detail?lessonId=${item.id}`}>
                <Tooltip title="Chi tiết">
                  <SC.btnLightGreen>
                    <EyeOutlined />
                  </SC.btnLightGreen>
                </Tooltip>
              </Link>
            }
          </Space>
        );
      }
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
            bordered="true"
            scroll={{
              x: 1100
            }}
            pagination={{
              onChange: onPageChange,
              total: totalItems,
              defaultCurrent: currentPage,
              defaultPageSize: Constants.LESSONS_TABLE_ROW_NUMBER,
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
