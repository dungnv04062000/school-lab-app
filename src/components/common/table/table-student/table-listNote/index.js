import { Table, Space, Popconfirm, message, Tooltip } from "antd";
import { EyeOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import * as TimeUtil from "../../../../../util/TimeUtil";
import React, { useState } from "react";
import * as SC from "../../../CustomButton/styled";
import AppDrawer from "../../../drawer";
import FormViewNote from "../../../form/form-view-note";
import SkeletonApp from "../../../Skeleton";
import BaseAPI from "../../../../../util/BaseAPI";
import * as Constants from "../../../../../util/Constants";

export default function TableStudentListNote({ refresh, notes, totalItems, currentPage, onPageChange }) {
  const [open, setOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const showDrawer = (note) => {
    setOpen(true);
    setCurrentNote(note);
  };

  const handleDeleteNote = (id) => {
    const response = BaseAPI.delete(`/notes/${id}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Xoá ghi chú thành công.");
          refresh();
        } else {
          message.error(res?.response?.data?.message || "Xóa thất bại");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "no",
      width: 60,
      align: "center",
      render: (value, option, index) => {
        return Constants.NOTES_TABLE_ROW_NUMBER * (currentPage - 1) + index + 1;
      }
    },

    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content"
    },
    {
      title: "Dự án",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 300
    },
    {
      title: "Thời gian tạo",
      dataIndex: "create_at",
      key: "createAt",
      width: 160,
      render: (value) => {
        return TimeUtil.convertUTCtoDatetime(value);
      }
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "update_at",
      key: "updateAt",
      width: 160,
      render: (value) => {
        return value ? TimeUtil.convertUTCtoDatetime(value) : null;
      }
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 130,
      align: "center",
      render: (value, item, index) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <SC.btnLightGreen onClick={() => showDrawer(item)}>
              <EyeOutlined />
            </SC.btnLightGreen>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa ghi chú này?"
              onConfirm={() => handleDeleteNote(item.id)}
              placement="topRight"
              okText="Xóa"
              cancelText="Hủy bỏ"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red"
                  }}
                />
              }
            >
              <SC.btnRed>
                <DeleteOutlined />
              </SC.btnRed>
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];
  return (
    <>
      <AppDrawer
        onClose={onClose}
        open={open}
        content={
          <>
            <FormViewNote refresh={refresh} currentNote={currentNote} onClose={onClose} />
          </>
        }
      />
      <SkeletonApp
        content={
          <Table
            rowKey={"id"}
            size="small"
            dataSource={notes}
            columns={columns}
            style={{ minHeight: 700, marginTop: 10 }}
            bordered="true"
            scroll={{
              x: 1000
            }}
            pagination={{
              defaultCurrent: currentPage,
              defaultPageSize: 15,
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
