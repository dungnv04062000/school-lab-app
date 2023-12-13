import { Space, Table, Modal, Popconfirm, message, Row, Col, Form, Input, Tooltip, Select } from "antd";
import React, { useEffect, useState } from "react";
import * as SC from "../../../../CustomButton/styled";
import SkeletonApp from "../../../../Skeleton";
import { QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import BaseAPI from "../../../../../../util/BaseAPI";
import AppDrawer from "../../../../drawer";
import Loading from "../../../../loading";
import * as TimeUtil from "../../../../../../util/TimeUtil";
import { useSelector } from "react-redux";
import { semestersSelector, userInfoSelector } from "../../../../../../redux/selector";

export default function TableClassTeacher({ classId }) {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    getTeachers();
  }, []);

  const userInfo = useSelector(userInfoSelector);
  const semesters = useSelector(semestersSelector);
  const semesterId = semesters[0]?.id;
  const [campusTeachers, setCampusTeachers] = useState([]);

  useEffect(() => {
    let response = BaseAPI.get("/campus-teachers", {
      params: {
        campus_id: userInfo.campus_id,
        semester_id: semesterId
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setCampusTeachers(res.data.items);
        } else {
          setCampusTeachers([]);
        }
      })
      .catch((err) => {
        setCampusTeachers([]);
      });
  }, []);

  const getTeachers = () => {
    let response = BaseAPI.get(`/class-teacher/${classId}`, {
      params: {
        teacher: teacher?.trim()
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setTeachers(res.data.items);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          setTeachers(null);
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setTeachers(null);
      });
  };

  const handleTeacherChange = (e) => {
    setTeacher(e.target.value);
  };

  const handleRemoveClassTeacher = (classTeacher) => {
    let response = BaseAPI.delete(`/class-teacher/${classTeacher?.id}`);
    return response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Xóa thành công");
          getTeachers();
        } else {
          message.error(res?.response?.data?.service_message || "Xóa thất bại");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState(null);
  const handleTeacherIdChange = (value) => {
    setTeacherId(value);
  };

  const handleAddTeacher = () => {
    setLoading(true);
    let response = BaseAPI.post(`/class-teacher`, {
      class_id: classId,
      teacher_id: teacherId
    });

    response
      .then((res) => {
        if (res?.status === 201) {
          message.success("Thêm thành công");
          getTeachers();
          handleClose();
        } else {
          message.error(res?.response?.data?.message || "Thêm thất bại");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const columns = [
    {
      title: "Mã số",
      dataIndex: "teacher_id",
      width: 100,
      fixed: "left",
      key: "teacherId",
      sorter: (a, b) => a.teacher_id.localeCompare(b.teacher_id),
      render: (value) => {
        return <b>{value}</b>;
      }
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "name",
      ellipsis: true
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      filters: [
        {
          text: "Nam",
          value: "MALE"
        },
        {
          text: "Nữ",
          value: "FEMALE"
        }
      ],
      filterSearch: true,
      onFilter: (value, record) => record.gender.startsWith(value),
      render: (value) => {
        return value === "MALE" ? "Nam" : "Nữ";
      }
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_date",
      key: "dob",
      width: 110,
      render: (value) => {
        return value ? TimeUtil.convertUTCtoDate(value) : "";
      }
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone",
      width: 140
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 100,
      key: "action",
      fixed: "right",
      align: "center",
      render: (_, item, index) => (
        <Space size="small">
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa giáo viên này khỏi lớp?"
              onConfirm={() => handleRemoveClassTeacher(item)}
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

  const { Option } = Select;

  return (
    <>
      <div className="filter-ad-editClass">
        <Row justify="space-between" align="bottom">
          <Col span={16}>
            <Form onFinish={getTeachers}>
              <Row gutter={[10, 10]} justify="start" align="bottom">
                <Col span={12}>
                  <label>Giáo viên</label>
                  <Form.Item>
                    <Input size="large" onBlur={handleTeacherChange} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <SC.btnWhite type="submit">Tìm kiếm</SC.btnWhite>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col>
            <Form.Item>
              <SC.btnBlue onClick={showModal}>Thêm giáo viên</SC.btnBlue>
            </Form.Item>
          </Col>
        </Row>

        <AppDrawer
          title="Thêm giáo viên dạy lớp này"
          open={open}
          onClose={handleClose}
          content={
            <>
              <Form onFinish={handleAddTeacher}>
                <label>Chọn giáo viên</label>
                <Form.Item>
                  <Select size="large" onChange={handleTeacherIdChange}>
                    {campusTeachers.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.id} {" - "}
                          {item.full_name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item>{loading ? <Loading /> : <SC.btnBlue>Thêm</SC.btnBlue>}</Form.Item>
              </Form>
            </>
          }
        />
      </div>
      <h4>
        Số giáo viên: <strong>{teachers?.length}</strong>
      </h4>
      <SkeletonApp
        content={
          <Table
            rowKey={"teacher_id"}
            size="small"
            columns={columns}
            dataSource={teachers}
            bordered="true"
            scroll={{
              x: 900
            }}
            pagination={{
              showSizeChanger: false,
              hideOnSinglePage: true,
              position: ["none", "bottomCenter"]
            }}
          />
        }
      />
    </>
  );
}
