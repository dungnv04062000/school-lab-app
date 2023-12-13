import React, { useEffect, useState } from "react";
import "./style.scss";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import { Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import SkeletonApp from "../../../components/common/Skeleton";
import { useNavigate } from "react-router-dom";
import BaseAPI from "../../../util/BaseAPI";
import * as S3 from "../../../util/S3Host";
import * as SC from "../../../components/common/CustomButton/styled";
import * as Constants from "../../../util/Constants";
import * as TimeUtil from "../../../util/TimeUtil";
import { useSelector } from "react-redux";
import { semestersSelector } from "../../../redux/selector";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Submissions() {
  const navigate = useNavigate();
  const [title, setTitle] = useState(null);
  const [createAtFrom, setCreateAtFrom] = useState(null);
  const [createAtTo, setCreateAtTo] = useState(null);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("DESC");

  const [submissions, setSubmissions] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const semesters = useSelector(semestersSelector);
  const [semesterId, setSemesterId] = useState("ALL");

  useEffect(() => {
    getSubmissions();
  }, [page]);

  const getSubmissions = () => {
    let response = BaseAPI.get(`/submissions/owner`, {
      params: {
        semester_id: semesterId === "ALL" ? null : semesterId,
        lesson_title: title?.trim(),
        create_at_from: createAtFrom,
        create_at_to: createAtTo,
        order_by: orderBy,
        page: page
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setSubmissions(res.data.items);
          setTotalItems(res.data.total_items);
        } else {
          setSubmissions([]);
          setTotalItems(0);
        }
      })
      .catch((err) => {
        setSubmissions([]);
        setTotalItems(0);
      });
  };

  const handleOrderByChange = (value) => {
    setOrderBy(value);
  };
  const onSearch = (values) => {
    getSubmissions();
  };

  const handleSemesterChange = (value) => {
    setSemesterId(value);
  };

  const handleTitleSearchChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCreateAtSearchChange = (value) => {
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

  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "no",
      width: 65,
      align: "center",
      render: (value, option, index) => {
        return Constants.SUBMISSIONS_TABLE_ROW_NUMBER * (page - 1) + index + 1;
      }
    },
    {
      title: "Học kỳ",
      dataIndex: "semester_name",
      key: "semesterName",
      width: 100
    },
    {
      title: "Năm",
      dataIndex: "year",
      key: "year",
      width: 50
    },
    {
      title: "Môn học",
      dataIndex: "subject_name",
      key: "subjectName",
      width: 100
    },
    {
      title: "Dự án",
      dataIndex: "lesson_name",
      key: "lesonName",
      ellipsis: true,
      render: (value) => <b>{value}</b>
    },
    {
      title: "Đính kèm",
      key: "lesonName",
      ellipsis: true,
      render: (item, index) => {
        return (
          <a
            style={{ fontSize: 14 }}
            className="attachment"
            target={"_blank"}
            href={`${S3.HOST}${item?.attachment_url}`}
          >
            {item?.attachment_url?.substring(`submission/${item?.id}/`.length)}
          </a>
        );
      }
    },
    {
      title: "Thời gian nộp",
      key: "createAt",
      width: 160,
      render: (item, index) => {
        return TimeUtil.convertUTCtoDatetime(item?.update_at ? item.update_at : item?.create_at);
      }
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 210,
      align: "center",
      render: (item, _) => {
        return item?.status === "ONTIME" ? (
          <Tag color="green">
            <b>Đúng hạn</b>
          </Tag>
        ) : item?.late_time ? (
          <Tag color="red">
            <b>Muộn {TimeUtil.convertTimestampToString(item?.late_time)}</b>
          </Tag>
        ) : (
          ""
        );
      }
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 110,
      align: "center",
      fixed: "right",
      render: (value, item, index) => (
        <Space size="small">
          {
            <Tooltip title="Chi tiết">
              <SC.btnLightGreen type="primary" onClick={() => navigate(`/submissions/detail?submissionId=${item.id}`)}>
                <EyeOutlined />
              </SC.btnLightGreen>
            </Tooltip>
          }
        </Space>
      )
    }
  ];
  document.title = "Danh sách nộp bài";
  return (
    <LayoutHomeList
      content={
        <div className="list-excercise-teacher">
          <h2>Danh sách nộp bài</h2>
          <div className="filter-listExcercise">
            <Form onFinish={onSearch}>
              <Row gutter={[10, 0]} justify="start" align="bottom">
                <Col xxl={3} xl={5} lg={5} md={12} sm={12} xs={24}>
                  <Form.Item>
                    <label>Học kỳ</label>
                    <Select defaultValue={"ALL"} size="large" onChange={handleSemesterChange} placeholder="Chọn học kỳ">
                      <Option key={"all"} value={"ALL"}>
                        Tất cả
                      </Option>
                      {semesters.map((item) => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name} - {item.year}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xxl={5} xl={5} lg={5} md={12} sm={12} xs={24}>
                  <label>Dự án</label>
                  <Form.Item>
                    <Input size="large" onChange={handleTitleSearchChange} />
                  </Form.Item>
                </Col>
                {/* <Col>
                  <Form.Item>
                    <label>Môn học</label>
                    <Select defaultValue="a" size="large" onChange={handleChange}>
                      <Option value="a">Vật Lí</Option>
                      <Option value="b">Toán</Option>
                      <Option value="c">Hóa</Option>
                      <Option value="d">Khoa học</Option>
                    </Select>
                  </Form.Item>
                </Col> */}

                <Col>
                  <Form.Item>
                    <label>Sắp xếp theo</label>
                    <Select defaultValue="DESC" size="large" onChange={handleOrderByChange}>
                      <Option value="DESC">Mới nhất</Option>
                      <Option value="ASC">Cũ nhất</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <label>Thời gian nộp</label>
                    <RangePicker size="large" format="DD-MM-yyyy" onChange={handleCreateAtSearchChange} />
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
          <div>
            <SkeletonApp
              content={
                <Table
                  rowKey={"id"}
                  size="small"
                  dataSource={submissions}
                  columns={columns}
                  style={{ minHeight: 700 }}
                  bordered="true"
                  scroll={{ x: 1300 }}
                  pagination={{
                    onChange: handlePageChange,
                    total: totalItems,
                    defaultCurrent: 1,
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
