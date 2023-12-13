import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tooltip
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as SC from "../../../CustomButton/styled";
import SkeletonApp from "../../../Skeleton";
import "./style.scss";
import BaseAPI from "../../../../../util/BaseAPI";
import { semestersSelector, userInfoSelector } from "../../../../../redux/selector";
import { useDispatch, useSelector } from "react-redux";
import { ReloadOutlined, DeleteOutlined, EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import * as TimeUtil from "../../../../../util/TimeUtil";
import { loadSemesters } from "../../../../../redux/slices/semesterSlice";
import { useForm } from "antd/lib/form/Form";
import Loading from "../../../loading";
import AppDrawer from "../../../drawer";
import moment from "moment";

export default function TableSemesters() {
  const nagative = useNavigate();

  const [selectedSemester, setSelectedSemester] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const semesterNameRef = useRef();
  const yearRef = useRef();

  const [startAt, setStartAt] = useState(null);

  const [semesterNameUpdate, setSemesterNameUpdate] = useState(null);
  const [yearUpdate, setYearUpdate] = useState(null);

  const userInfo = useSelector(userInfoSelector);

  const [form] = useForm();

  const handleStartAtChange = (value) => {
    if (value !== null) {
      setStartAt(value.unix());
    } else {
      setStartAt(null);
    }
  };

  const handleCreateSemester = () => {
    if (semesterNameRef.current.input.value?.trim()?.length === 0) {
      message.error("Vui lòng nhập tên học kỳ");
    } else {
      setLoading(true);
      let response = BaseAPI.post(`/semesters`, {
        campus_id: userInfo.campus_id,
        name: semesterNameRef.current.input.value.trim(),
        start_at: startAt,
        year: yearRef.current.input.value.trim()
      });

      response
        .then((res) => {
          if (res?.status === 201) {
            message.success("Tạo thành công");
            form.resetFields();
            handleCloseCreateSemester();
            dispatch(loadSemesters());
          } else {
            message.error(res?.response?.data?.message || "Tạo thất bại");
          }
          setLoading(false);
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
          setLoading(false);
        });
    }
  };

  const handleUpdateSemester = () => {
    if (semesterNameUpdate?.trim()?.length === 0) {
      message.error("Vui lòng nhập tên học kỳ");
    } else if (!startAt) {
      message.error("Vui lòng nhập ngày bắt đầu");
    } else {
      setLoading(true);
      let response = BaseAPI.patch(`/semesters/${selectedSemester?.id}`, {
        name: semesterNameUpdate?.trim(),
        start_at: startAt,
        year: yearUpdate ? Number(yearUpdate) : null
      });

      response
        .then((res) => {
          if (res?.status === 200) {
            message.success("Cập nhật thành công");
            handleCloseUpdateSemester();
            dispatch(loadSemesters());
          } else {
            message.error(res?.response?.data?.message || "Cập nhật thất bại");
          }
          setLoading(false);
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
          setLoading(false);
        });
    }
  };

  const handleShowCreateSemester = () => {
    setOpen(true);
  };
  const handleCloseCreateSemester = () => {
    setOpen(false);
  };

  const handleShowUpdateSemester = (item) => {
    setSemesterNameUpdate(item?.name);
    setStartAt(item?.start_at);
    setYearUpdate(item?.year);
    setSelectedSemester(item);
    setTimeout(() => {
      setOpenUpdate(true);
    }, 500);
  };

  const handleCloseUpdateSemester = () => {
    setOpenUpdate(false);
  };

  const handleNameChange = (e) => {
    setSemesterNameUpdate(e.target.value);
  };

  const handleYearChange = (e) => {
    setYearUpdate(e.target.value);
  };

  const semesters = useSelector(semestersSelector);

  const [open, setOpen] = useState(false);

  const handleDeleteSemester = (id) => {
    setLoading(true);
    const response = BaseAPI.delete(`/semesters/${id}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Xoá học kỳ thành công");
          dispatch(loadSemesters());
        } else {
          message.error(res?.response?.data?.message || "Xóa thất bại");
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
      title: "Tên học kỳ",
      dataIndex: "name",
      key: "semesterName",
      fixed: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value) => <b>{value}</b>
    },
    {
      title: "Năm học",
      width: 120,
      dataIndex: "year",
      sorter: (a, b) => a.year - b.year,
      key: "className"
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_at",
      key: "startAt",
      width: 110,
      render: (value) => {
        return TimeUtil.convertUTCtoDate(value);
      }
    },
    {
      title: "Ngày tạo",
      dataIndex: "create_at",
      key: "createAt",
      width: 110,
      render: (value) => {
        return TimeUtil.convertUTCtoDate(value);
      }
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 120,
      align: "center",
      key: "action",
      fixed: "right",
      render: (_, item, index) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <SC.btnLightGreen onClick={() => handleShowUpdateSemester(item)}>
              <EditOutlined />
            </SC.btnLightGreen>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa học kỳ này?"
              onConfirm={() => handleDeleteSemester(item.id)}
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
              <SC.btnRed type="primary">
                <DeleteOutlined />
              </SC.btnRed>
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const dispatch = useDispatch();

  return (
    <>
      <Row gutter={[10, 10]} className="filter-manager-class">
        <SC.btnWhite onClick={() => dispatch(loadSemesters())}>
          <ReloadOutlined />
        </SC.btnWhite>
        <Col>
          <SC.btnBlue onClick={handleShowCreateSemester}>Tạo học kỳ</SC.btnBlue>
        </Col>
        <AppDrawer
          title="Tạo học kỳ mới"
          open={open}
          onClose={handleCloseCreateSemester}
          content={
            <Form form={form} onFinish={handleCreateSemester}>
              <Row>
                <Col span={24}>
                  <label>Tên học kỳ</label>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên học kỳ"
                      }
                    ]}
                  >
                    <Input type="text" size="large" ref={semesterNameRef} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <label>Ngày bắt đầu</label>
                  <Form.Item
                    name="startAt"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày bắt đầu học kỳ"
                      }
                    ]}
                  >
                    <DatePicker size="large" onChange={handleStartAtChange} format={"DD-MM-yyyy"} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <label>Năm học</label>
                  <Form.Item
                    name="year"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập năm học"
                      }
                    ]}
                  >
                    <Input type="number" min={2020} size="large" ref={yearRef} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>{loading ? <Loading /> : <SC.btnBlue>Tạo</SC.btnBlue>}</Row>
            </Form>
          }
        />

        <AppDrawer
          title="Chỉnh sửa học kỳ"
          onClose={handleCloseUpdateSemester}
          open={openUpdate}
          content={
            <>
              <Form onFinish={handleUpdateSemester}>
                <Row>
                  <Col span={24}>
                    <label>Tên học kỳ</label>
                    <Form.Item>
                      <Input type="text" size="large" value={semesterNameUpdate} onChange={handleNameChange} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <label>Ngày bắt đầu</label>
                    <Form.Item>
                      <DatePicker
                        value={startAt ? moment(startAt * 1000) : null}
                        size="large"
                        onChange={handleStartAtChange}
                        format={"DD-MM-yyyy"}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <label>Năm học</label>
                    <Form.Item>
                      <Input type="number" min={2020} size="large" value={yearUpdate} onChange={handleYearChange} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>{loading ? <Loading /> : <SC.btnBlue>Cập nhật</SC.btnBlue>}</Row>
              </Form>
            </>
          }
        />
      </Row>
      <h2 style={{ marginTop: 20 }}>Danh sách học kỳ</h2>
      <SkeletonApp
        content={
          <>
            <Row>
              <span>
                Tổng số học kỳ: <strong>{semesters?.length}</strong>
              </span>
            </Row>
            <Table
              rowKey={"id"}
              size="small"
              dataSource={semesters}
              columns={columns}
              style={{ minHeight: 700 }}
              bordered="true"
              scroll={{
                x: 700
              }}
              pagination={{
                showSizeChanger: false,
                hideOnSinglePage: true,
                position: ["none", "bottomCenter"]
              }}
            />
          </>
        }
      />
    </>
  );
}
