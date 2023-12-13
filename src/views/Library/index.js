import { Col, DatePicker, Form, Input, message, Popconfirm, Row, Select, Space, Table, Tooltip } from "antd";
import { DeleteOutlined, QuestionCircleOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useEffect } from "react";
import "./library.scss";
import LayoutHomeList from "../../components/layouts/mainLayout";
import BaseAPI from "../../util/BaseAPI";
import * as S3 from "../../util/S3Host";
import * as SC from "../../components/common/CustomButton/styled";
import * as Constants from "../../util/Constants";
import * as TimeUtil from "../../util/TimeUtil";
import { Link, useNavigate } from "react-router-dom";
import SkeletonApp from "../../components/common/Skeleton";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../redux/selector";
import FormCreateLibrary from "../../components/common/form/Form-create-library";
import AppDrawer from "../../components/common/drawer";
import FormEditLibrary from "../../components/common/form/Form-edit-library";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Library() {
  const userInfor = useSelector(userInfoSelector);
  const navigate = useNavigate();
  const [title, setTitle] = useState(null);
  const [createBy, setCreateBy] = useState(null);
  const [createAtFrom, setCreateAtFrom] = useState(null);
  const [createAtTo, setCreateAtTo] = useState(null);
  const [page, setPage] = useState(1);

  const [dataSource, setDataSource] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [openCreate, setOpenCreate] = useState(false);
  const showCreateDrawer = () => {
    setOpenCreate(true);
  };
  const onCreateClose = () => {
    setOpenCreate(false);
  };

  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const showUpdateDrawer = (item) => {
    setSelectedTutorial(item);
    setOpenUpdate(true);
  };
  const onUpdateClose = () => {
    setOpenUpdate(false);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "no",
      width: 55,
      align: "center",
      render: (value, option, index) => {
        return Constants.SUBMISSIONS_TABLE_ROW_NUMBER * (page - 1) + index + 1;
      }
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true
    },

    {
      title: "Tác giả",
      // dataIndex: "create_by",
      width: 220,
      key: "createBy",
      render: (value, item, index) => {
        return item?.create_by === userInfor?.id ? (
          <b>
            {item?.create_by} {item?.create_by_fullname || ""}
          </b>
        ) : (
          `${item?.create_by} ${item?.create_by_fullname || ""}`
        );
      }
    },
    {
      title: "Thời gian",
      dataIndex: "create_at",
      key: "createAt",
      width: 160,
      render: (value) => {
        return TimeUtil.convertUTCtoDatetime(value);
      }
    },
    {
      title: "Tệp đính kèm",
      dataIndex: "attachment_url",
      key: "attachment_url",
      width: 350,
      ellipsis: true,
      render: (value, item, index) => {
        return (
          <a target={"_blank"} href={`${S3.HOST}${value}`}>
            {value?.substring(`tutorials/${item?.id}/`.length)}
          </a>
        );
      }
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 170,
      align: "center",
      render: (value, item, index) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <SC.btnLightGreen type="primary" onClick={() => navigate(`/library/detail?libraryId=${item.id}`)}>
              <EyeOutlined />
            </SC.btnLightGreen>
          </Tooltip>
          {!userInfor?.roles?.includes("STUDENT") ? (
            item?.create_by === userInfor?.id ? (
              <>
                <Tooltip title="Cập nhật">
                  <SC.btnBlue onClick={() => showUpdateDrawer(item)}>
                    <EditOutlined />
                  </SC.btnBlue>
                </Tooltip>
                <Tooltip title="Xóa">
                  <Popconfirm
                    title="Xóa tài liệu này?"
                    onConfirm={() => handleDelete(item.id)}
                    placement="topRight"
                    okText="Xóa"
                    cancelText="Hủy bỏ"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  >
                    <SC.btnRed>
                      <DeleteOutlined />
                    </SC.btnRed>
                  </Popconfirm>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Bạn không phải tác giả">
                  <SC.btnDisable>
                    <EditOutlined />
                  </SC.btnDisable>
                </Tooltip>
                <Tooltip title="Bạn không phải tác giả">
                  <SC.btnDisable>
                    <DeleteOutlined />
                  </SC.btnDisable>
                </Tooltip>
              </>
            )
          ) : (
            <></>
          )}
        </Space>
      )
    }
  ];

  useEffect(() => {
    getLibrary();
  }, []);
  const getLibrary = () => {
    let response = BaseAPI.get("/tutorials", {
      params: {
        title: title?.trim()?.length > 0 ? title?.trim() : null,
        campus_id: userInfor.campus_id,
        create_by: createBy && createBy?.trim()?.length > 0 ? createBy?.trim() : null,
        create_at_from: createAtFrom,
        create_at_to: createAtTo,
        page: page
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setDataSource(res.data.items);
          setTotalItems(res.data.total_items);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          setDataSource([]);
          setTotalItems(0);
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setDataSource([]);
        setTotalItems(0);
      });
  };
  const handleDelete = (id) => {
    const response = BaseAPI.delete(`tutorials/${id}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Xóa thành công");
          getLibrary();
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const onSearch = () => {
    getLibrary();
  };

  const handleSearchTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleSearchCreateBy = (e) => {
    setCreateBy(e.target.value);
  };

  const handleSearchCreateAt = (value) => {
    try {
      setCreateAtFrom(value[0].unix());
    } catch (error) {
      setCreateAtFrom(null);
    }
    try {
      setCreateAtTo(value[1].unix());
    } catch (error) {
      setCreateAtTo(null);
    }
  };

  const handlePageChange = (value) => {
    setPage(value);
  };
  document.title = "Tài liệu";
  return (
    <LayoutHomeList
      content={
        <div className="library">
          <h2>Tài liệu tham khảo</h2>
          <div className="filter-library">
            <Form onFinish={onSearch}>
              <Row gutter={[10, 10]} justify="start" align="bottom">
                <Col xs={24} sm={12} md={10} lg={8} xl={5}>
                  <label>Tiêu đề</label>
                  <Form.Item>
                    <Input size="large" onChange={handleSearchTitle} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={4} lg={4} xl={4}>
                  <Form.Item>
                    <label>Tác giả</label>
                    <Input size="large" onChange={handleSearchCreateBy} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={10} lg={6} xl={5}>
                  <Form.Item>
                    <label>Ngày đăng</label>
                    <RangePicker size="large" format="MM-DD-yyyy" onChange={handleSearchCreateAt} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <SC.btnWhite>Tìm kiếm</SC.btnWhite>
                  </Form.Item>
                </Col>
                {userInfor?.roles.includes("TEACHER") || userInfor?.roles.includes("SCHOOL_ADMIN") ? (
                  <Col>
                    <Form.Item>
                      <SC.btnBlue onClick={showCreateDrawer}>Tạo</SC.btnBlue>
                      <AppDrawer
                        onClose={onCreateClose}
                        open={openCreate}
                        title="Đăng tải tài liệu"
                        content={
                          <>
                            <FormCreateLibrary userInfor={userInfor} refresh={getLibrary} onClose={onCreateClose} />
                          </>
                        }
                      />
                      <AppDrawer
                        onClose={onUpdateClose}
                        open={openUpdate}
                        title="Cập nhật tài liệu"
                        content={
                          <>
                            <FormEditLibrary tutorial={selectedTutorial} refresh={getLibrary} onClose={onUpdateClose} />
                          </>
                        }
                      />
                    </Form.Item>
                  </Col>
                ) : (
                  <></>
                )}
              </Row>
            </Form>
          </div>
          <div>
            <SkeletonApp
              content={
                <Table
                  rowKey={"id"}
                  size="small"
                  dataSource={dataSource}
                  columns={columns}
                  style={{ minHeight: 700 }}
                  bordered="true"
                  scroll={{
                    x: 900
                  }}
                  pagination={{
                    onChange: handlePageChange,
                    total: totalItems,
                    defaultPageSize: Constants.SUBMISSIONS_TABLE_ROW_NUMBER,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                    position: ["none", "bottomCenter"]
                  }}
                />
              }
            />
          </div>
        </div>
      }
    />
  );
}
