import React from "react";
import { Table } from "antd";
import SkeletonApp from "../../../Skeleton";
import * as TimeUtl from "../../../../../util/TimeUtil";

export default function TableTeacherListStudent({ students }) {
  const columns = [
    {
      title: "Mã số",
      width: 110,
      dataIndex: "roll_number",
      ellipsis: true,
      fixed: "left",
      sorter: (a, b) => a.roll_number.localeCompare(b.roll_number),
      render: (value) => <b>{value}</b>
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      width: 170,
      ellipsis: true,
      sorter: (a, b) => a.full_name.localeCompare(b.full_name)
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      width: 100,
      ellipsis: true,
      render: (value) => {
        return value === "MALE" ? "Nam" : "Nữ";
      }
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_date",
      width: 100,
      render: (value) => (value ? TimeUtl.convertUTCtoDate(value) : null)
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true
    },
    {
      title: "Số điện thoại",
      width: 130,
      dataIndex: "phone_number"
    }
  ];
  return (
    <>
      <SkeletonApp
        content={
          <Table
            rowKey={"roll_number"}
            size="small"
            dataSource={students}
            columns={columns}
            style={{ minHeight: 700 }}
            bordered="true"
            scroll={{
              x: 900
            }}
            pagination={{
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
