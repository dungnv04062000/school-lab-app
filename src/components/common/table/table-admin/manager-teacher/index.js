import { message, Space, Table, Tooltip, Col, Form, Row, Select, Input } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import * as SC from "../../../CustomButton/styled";
import SkeletonApp from "../../../Skeleton";
import * as Constants from "../../../../../util/Constants";
import BaseAPI from "../../../../../util/BaseAPI";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../../../../redux/selector";
const { Option } = Select;

export default function TableAdManagerTeacher({ semesterId }) {
  const userInfor = useSelector(userInfoSelector);
  const [className, setClassName] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [gender, setGender] = useState("ALL");
  const [page, setPage] = useState(1);

  const [teacherData, setTeacherData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const handleTeacherChange = (e) => {
    setTeacher(e.target.value);
  };

  const handleClassChange = (e) => {
    setClassName(e.target.value);
  };

  const handleGenderChange = (value) => {
    setGender(value);
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  useEffect(() => {
    if (semesterId) {
      getTeachers();
    }
  }, [page]);

  const getTeachers = () => {
    let response = BaseAPI.get("/campus-teachers", {
      params: {
        semester_id: semesterId,
        campus_id: userInfor.campus_id,
        class_name: className?.trim()?.length > 0 ? className.trim() : null,
        teacher: teacher,
        gender: gender === "ALL" ? null : gender,
        page: page
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setTeacherData(res.data.items);
          setTotalItems(res.data.total_items);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          setTeacherData([]);
          setTotalItems(0);
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setTeacherData([]);
        setTotalItems(0);
      });
  };

  const columns = [
    {
      title: "Mã giáo viên",
      dataIndex: "id",
      key: "id",
      width: 140,
      fixed: "left",
      sorter: (a, b) => a.id.localeCompare(b.id),
      render: (value) => <b>{value}</b>
    },
    {
      title: "Tên giáo viên",
      dataIndex: "full_name",
      key: "fullName"
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (value) => {
        return value === "MALE" ? "Nam" : "Nữ";
      }
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 300
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phoneNumber",
      width: 160
    },
    {
      title: "Lớp chủ nhiệm",
      dataIndex: "class_name",
      key: "className",
      width: 150
    }
  ];

  return (
    <>
      <div className="filter-ad-manager-teacher">
        <Form onFinish={getTeachers}>
          <Row gutter={[10, 10]} justify="start" align="bottom">
            <Col xl={6} lg={6} md={8} sm={12} xs={24}>
              <Form.Item>
                <label>Giáo viên</label>
                <Input size="large" onChange={handleTeacherChange} />
              </Form.Item>
            </Col>
            <Col xl={6} lg={6} md={8} sm={12} xs={24}>
              <Form.Item>
                <label>Lớp chủ nhiệm</label>
                <Input size="large" onChange={handleClassChange} />
              </Form.Item>
            </Col>
            <Col xl={3} lg={3} md={4} sm={12} xs={24}>
              <label>Giới tính</label>
              <Form.Item>
                <Select defaultValue="ALL" size="large" onChange={handleGenderChange}>
                  <Option value="ALL">Tất cả</Option>
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <SC.btnWhite>Tìm kiếm</SC.btnWhite>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <h2>Danh sách giáo viên</h2>
      <div className="table-ad-manager-teacher">
        <SkeletonApp
          content={
            <>
              <Row>
                <span>
                  Tổng số giáo viên: <strong>{totalItems}</strong>
                </span>
              </Row>
              <Table
                rowKey={"id"}
                size="small"
                columns={columns}
                dataSource={teacherData}
                bordered="true"
                scroll={{
                  x: 1100
                }}
                pagination={{
                  onChange: handlePageChange,
                  total: totalItems,
                  // defaultCurrent: 1,
                  defaultPageSize: Constants.LESSONS_TABLE_ROW_NUMBER,
                  hideOnSinglePage: true,
                  showSizeChanger: false,
                  position: ["none", "bottomCenter"]
                }}
              />
            </>
          }
        />
      </div>
    </>
  );
}
