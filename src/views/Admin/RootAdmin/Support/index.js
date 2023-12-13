import React from "react";
import "./style.scss";
import TableAdListSupport from "../../../../components/common/table/table-admin/manager-support";
import LayoutHomeList from "../../../../components/layouts/mainLayout";
import * as SC from "../../../../components/common/CustomButton/styled";
import { Col, DatePicker, Form, message, Row, Select, Typography } from "antd";
import { useState } from "react";
import BaseAPI from "../../../../util/BaseAPI";
import { useEffect } from "react";

const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function AdminListSupport() {
  const [supports, setSupports] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [priority, setPriority] = useState("ALL");
  const [sort, setSort] = useState("DESC");
  const [createAtFrom, setCreateAtFrom] = useState(null);
  const [createAtTo, setCreateAtTo] = useState(null);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const handlePageChange = (value) => {
    setPage(value);
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleCreateAtSearchChange = (value) => {
    let createAtFrom = null;
    let createAtTo = null;
    try {
      createAtFrom = value[0].unix() || null;
    } catch (error) {}
    try {
      createAtTo = value[1].unix() || null;
    } catch (error) {}

    setCreateAtFrom(createAtFrom);
    setCreateAtTo(createAtTo);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const getSupports = () => {
    let response = BaseAPI.get(`/supports`, {
      params: {
        priority: priority === "ALL" ? null : priority,
        status: status === "ALL" ? null : status,
        create_at_from: createAtFrom,
        create_at_to: createAtTo,
        type_sort: sort,
        page: page
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setSupports(res.data.items);
          setTotalItems(res.data.total_items);
        } else {
          setSupports([]);
          setTotalItems(0);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        setSupports([]);
        setTotalItems(0);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  useEffect(() => {
    getSupports();
  }, [page]);

  document.title = "Danh sách yêu cầu hỗ trợ";
  return (
    <LayoutHomeList
      content={
        <div className="admin-list-support">
          <Title level={2}>Danh sách yêu cầu hỗ trợ</Title>
          <div className="filter-ad-list-support">
            <Form onFinish={getSupports}>
              <Row gutter={[10, 10]} justify="start" align="bottom">
                <Col xxl={2} xl={4} lg={5} md={8} sm={12} xs={24}>
                  <label>Mức độ</label>
                  <Form.Item>
                    <Select defaultValue={"ALL"} size="large" onChange={handlePriorityChange}>
                      <Option value="ALL">Tất cả</Option>
                      <Option value="LOW">Thấp</Option>
                      <Option value="MEDIUM">Trung bình</Option>
                      <Option value="HIGH">Nghiêm trọng</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xxl={2} xl={4} lg={5} md={8} sm={12} xs={24}>
                  <label>Trạng thái</label>
                  <Form.Item>
                    <Select defaultValue={"ALL"} size="large" onChange={handleStatusChange}>
                      <Option value="ALL">Tất cả</Option>
                      <Option value="DONE">Đã xử lí</Option>
                      <Option value="WAITTING">Chờ xử lí</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xxl={2} xl={4} lg={5} md={8} sm={12} xs={24}>
                  <label>Sắp xếp theo</label>
                  <Form.Item>
                    <Select defaultValue={"DESC"} size="large" onChange={handleSortChange}>
                      <Option value={"ASC"}>Cũ nhất</Option>
                      <Option value={"DESC"}>Mới nhất</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={5} lg={5} md={8} sm={12} xs={24}>
                  <label>Thời gian</label>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn thời gian"
                      }
                    ]}
                  >
                    <RangePicker size="large" onChange={handleCreateAtSearchChange} />
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
          <TableAdListSupport
            supports={supports}
            refresh={getSupports}
            totalItems={totalItems}
            handlePageChange={handlePageChange}
          />
        </div>
      }
    />
  );
}
