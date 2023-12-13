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

export default function TableAdManagerStudent({ semesterId }) {
  const userInfor = useSelector(userInfoSelector);
  const [gradeId, setGradeId] = useState(0);
  const [className, setClassName] = useState(null);
  const [student, setStudent] = useState(null);
  const [gender, setGender] = useState("ALL");
  const [page, setPage] = useState(1);

  const [studentData, setStudentData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const handleStudentChange = (e) => {
    setStudent(e.target.value);
  };

  const handleClassChange = (e) => {
    setClassName(e.target.value);
  };

  const handleGenderChange = (value) => {
    setGender(value);
  };
  const handleGradeChange = (value) => {
    setGradeId(value);
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  useEffect(() => {
    getStudents();
  }, [page]);

  const getStudents = () => {
    let response = BaseAPI.get("/campus-students", {
      params: {
        semester_id: semesterId,
        campus_id: userInfor.campus_id,
        grade_id: gradeId === 0 ? null : gradeId,
        class_name: className?.trim()?.length > 0 ? className.trim() : null,
        student: student?.trim()?.length > 0 ? student.trim() : null,
        gender: gender === "ALL" ? null : gender,
        page: page
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setStudentData(res?.data?.items);
          setTotalItems(res?.data?.total_items);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          setStudentData([]);
          setTotalItems(0);
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setStudentData([]);
        setTotalItems(0);
      });
  };

  const columns = [
    {
      title: "Mã học sinh",
      dataIndex: "id",
      key: "id",
      width: 130,
      fixed: "left",
      sorter: (a, b) => a.id.localeCompare(b.id),
      render: (value) => <b>{value}</b>
    },
    {
      title: "Tên học sinh",
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
      width: 150
    },
    {
      title: "Khối",
      dataIndex: "grade_name",
      key: "gradeName",
      width: 100
    },
    {
      title: "Lớp",
      dataIndex: "class_name",
      key: "className",
      width: 120
    }
  ];

  return (
    <>
      <div className="filter-ad-manager-teacher">
        <Form onFinish={getStudents}>
          <Row gutter={[10, 10]} justify="start" align="bottom">
            <Col xl={6} lg={6} md={8} sm={12} xs={24}>
              <Form.Item>
                <label>Học sinh</label>
                <Input size="large" onChange={handleStudentChange} />
              </Form.Item>
            </Col>
            <Col xl={6} lg={6} md={8} sm={12} xs={24}>
              <Form.Item>
                <label>Lớp</label>
                <Input size="large" onChange={handleClassChange} />
              </Form.Item>
            </Col>
            <Col xl={3} lg={3} md={4} sm={8} xs={24}>
              <label>Khối</label>
              <Form.Item>
                <Select defaultValue={0} size="large" onChange={handleGradeChange}>
                  <Option key={0} value={0}>
                    Tất cả
                  </Option>
                  <Option key={1} value={1}>
                    Khối 10
                  </Option>
                  <Option key={2} value={2}>
                    Khối 11
                  </Option>
                  <Option key={3} value={3}>
                    Khối 12
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={3} lg={3} md={4} sm={8} xs={24}>
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
      <h2>Danh sách học sinh</h2>
      <div className="table-ad-manager-teacher">
        <SkeletonApp
          content={
            <>
              <Row>
                <span>
                  Tổng số học sinh: <strong>{totalItems}</strong>
                </span>
              </Row>
              <Table
                rowKey={"id"}
                size="small"
                columns={columns}
                dataSource={studentData}
                bordered="true"
                scroll={{
                  x: 1100
                }}
                pagination={{
                  showSizeChanger: false,
                  onChange: handlePageChange,
                  total: totalItems,
                  defaultPageSize: Constants.SUBMISSIONS_TABLE_ROW_NUMBER,
                  hideOnSinglePage: true,
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
