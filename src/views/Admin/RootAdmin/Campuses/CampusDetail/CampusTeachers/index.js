import { Col, Form, Input, message, Row, Select, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import BaseAPI from "../../../../../../util/BaseAPI";
import * as SC from "../../../../../../components/common/CustomButton/styled";
import SkeletonApp from "../../../../../../components/common/Skeleton";
import * as Constants from "../../../../../../util/Constants";

const { Option } = Select;

function CampusTeachers({ campusId }) {
  const [teachers, setTeachers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);

  const [name, setName] = useState(null);
  const [gender, setGender] = useState("ALL");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleGenderChange = (value) => {
    setGender(value);
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  const getTeachers = () => {
    let response = BaseAPI.get(`/root-admin/campus-teachers/${campusId}`, {
      params: {
        teacher: name?.trim(),
        gender: gender === "ALL" ? null : gender,
        page: page
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setTeachers(res.data.items);
          setTotalItems(res.data.total_items);
        } else {
          setTeachers([]);
          setTotalItems(0);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        setTeachers([]);
        setTotalItems(0);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  useEffect(() => {
    getTeachers();
  }, [page]);

  const columns = [
    {
      title: "STT",
      key: "no",
      width: 55,
      fixed: "left",
      align: "center",
      render: (value, item, index) => Constants.SUPPORT_TABLE_ROW_NUMBER * (page - 1) + 1 + index
    },
    {
      title: "Mã số",
      key: "id",
      dataIndex: "id",
      width: 100,
      fixed: "left",
      render: (value, item, index) => <b>{value}</b>
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "fullName",
      width: 185,
      fixed: "left"
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 75,
      render: (value) => (value === "MALE" ? "Nam" : "Nữ")
    },
    {
      title: "Số điện thoại",
      key: "phone",
      dataIndex: "phone_number",
      ellipsis: true,
      width: 110
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true
    },
    {
      title: "Trạng thái",
      dataIndex: "is_verify",
      key: "verify",
      width: 120,
      align: "center",
      render: (value) =>
        value ? (
          <Tag color="#00d618">
            <strong>Đã xác thực</strong>
          </Tag>
        ) : (
          <Tag color="#878787">
            <strong>Chưa xác thực</strong>
          </Tag>
        )
    }
  ];

  return (
    <>
      <Form>
        <Row gutter={[10, 10]} align="bottom">
          <Col xl={6} lg={6} md={8} sm={12} xs={24}>
            <Form.Item>
              <label>Giáo viên</label>
              <Input size="large" onChange={handleNameChange} />
            </Form.Item>
          </Col>
          <Col xl={3} lg={4} md={5} sm={6} xs={12}>
            <label>Giới tính</label>
            <Form.Item>
              <Select size="large" defaultValue="ALL" onChange={handleGenderChange}>
                <Option value="ALL">Tất cả</Option>
                <Option value="MALE">Nam</Option>
                <Option value="FEMALE">Nữ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <SC.btnWhite onClick={getTeachers}>Tìm kiếm</SC.btnWhite>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <SkeletonApp
        content={
          <Table
            rowKey={"id"}
            dataSource={teachers}
            columns={columns}
            bordered
            size="small"
            scroll={{
              x: 800
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
    </>
  );
}

export default CampusTeachers;
