import { Col, Form, Input, message, Popconfirm, Row, Space, Table, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import SkeletonApp from "../../../../components/common/Skeleton";
import LayoutHomeList from "../../../../components/layouts/mainLayout";
import BaseAPI from "../../../../util/BaseAPI";
import * as SC from "../../../../components/common/CustomButton/styled";
import * as TimeUtil from "../../../../util/TimeUtil";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined, EyeOutlined } from "@ant-design/icons";
import "./style.scss";
import AppDrawer from "../../../../components/common/drawer";
import Createampus from "./CreateCampus";
import EditCampus from "./EditCampus";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function Campuses() {
  const [campusName, setCampusName] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);
  const showCreate = () => {
    setOpenCreate(true);
  };

  const closeCreate = () => {
    setOpenCreate(false);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const showEdit = () => {
    setOpenEdit(true);
  };

  const closeEdit = () => {
    setOpenEdit(false);
  };

  const handleNameChange = (e) => {
    setCampusName(e.target.value);
  };

  const handleSelectCampus = (campus) => {
    setSelectedCampus(campus);
    showEdit();
  };

  const getCampuses = () => {
    let response = BaseAPI.get(`/root-admin/campuses`, {
      params: {
        name: campusName?.trim()
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setCampuses(res.data.items);
        } else {
          setCampuses([]);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        setCampuses([]);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const handleDeleteCampus = (id) => {
    let response = BaseAPI.delete(`/campuses/${id}`);

    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Xóa thành công");
          getCampuses();
        } else {
          message.error(res?.response?.data?.message || "Xóa thất bại");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  useEffect(() => {
    getCampuses();
  }, []);

  const navigate = useNavigate();

  const columns = [
    {
      title: "STT",
      key: "no",
      width: 55,
      fixed: "left",
      align: "center",
      render: (value, item, index) => index + 1
    },
    {
      title: "Tên Campus",
      key: "name",
      dataIndex: "name",
      width: 230,
      fixed: "left",
      render: (value, item, index) => <b>{value}</b>
    },
    {
      title: "Quản trị viên",
      key: "schoolAdmin",
      ellipsis: true,
      render: (value, item, index) => (
        <>
          <b>{item?.admin_id}</b> - {item?.admin_name}
        </>
      )
    },
    {
      title: "Địa chỉ",
      key: "address",
      ellipsis: true,
      width: 650,
      render: (value, item, index) => item?.street + ", " + item?.ward + ", " + item?.district + ", " + item?.city
    },
    {
      title: "Ngày tạo",
      key: "createAt",
      dataIndex: "create_at",
      width: 100,
      render: (value) => TimeUtil.convertUTCtoDate(value)
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 170,
      align: "center",
      key: "action",
      fixed: "right",
      render: (value, item, index) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <SC.btnLightGreen onClick={() => navigate(`/campuses/detail?campusId=${item?.id}`)}>
              <EyeOutlined />
            </SC.btnLightGreen>
          </Tooltip>
          <Tooltip title="Cập nhật">
            <SC.btnBlue onClick={() => handleSelectCampus(item)}>
              <EditOutlined />
            </SC.btnBlue>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa campus này?"
              onConfirm={() => handleDeleteCampus(item.id)}
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
    <LayoutHomeList
      content={
        <div className="campuses-wrapper">
          <Title level={3}>Danh sách Campus</Title>
          <Row justify="space-between" align="bottom">
            <Col xl={20} lg={20} md={18} sm={20} xs={20}>
              <Row gutter={[10, 10]} align="bottom">
                <Col xl={8} lg={12} md={12} sm={12} xs={16}>
                  <label>Tên Campus</label>
                  <Form.Item>
                    <Input type="text" size="large" value={campusName} onChange={handleNameChange} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <SC.btnWhite onClick={getCampuses}>Tìm kiếm</SC.btnWhite>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col>
              <Form.Item>
                <SC.btnBlue onClick={showCreate}>Tạo</SC.btnBlue>
              </Form.Item>
              <AppDrawer
                title="Tạo Campus mới"
                open={openCreate}
                onClose={closeCreate}
                content={<Createampus onClose={closeCreate} refresh={getCampuses} />}
              />
              <AppDrawer
                title="Cập nhật Campus"
                open={openEdit}
                onClose={closeEdit}
                content={<EditCampus campus={selectedCampus} onClose={closeEdit} refresh={getCampuses} />}
              />
            </Col>
          </Row>
          <SkeletonApp
            content={
              <Table
                rowKey={"id"}
                dataSource={campuses}
                columns={columns}
                size="small"
                bordered={true}
                scroll={{
                  x: 1300
                }}
                pagination={false}
              />
            }
          />
        </div>
      }
    />
  );
}

export default Campuses;
