import { Breadcrumb, message, Row, Space, Tabs, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutHomeList from "../../../../../components/layouts/mainLayout";
import BaseAPI from "../../../../../util/BaseAPI";
import CampusStudents from "./CampusStudents";
import CampusTeachers from "./CampusTeachers";
import "./style.scss";

function CampusDetail() {
  const queryString = useLocation().search;
  const campusId = new URLSearchParams(queryString).get("campusId");

  const [campus, setCampus] = useState(null);

  const getCampus = () => {
    let response = BaseAPI.get(`/root-admin/campuses/${campusId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setCampus(res.data.item);
        } else {
          setCampus(null);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        setCampus(null);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  useEffect(() => {
    getCampus();
  }, []);

  const navigate = useNavigate();
  const { Title } = Typography;
  document.title = campus?.name || "Thông tin campus";
  return (
    <LayoutHomeList
      content={
        <div className="campus-detail-wrapper">
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigate("/campuses")}>Danh sách campus</Breadcrumb.Item>
            <Breadcrumb.Item>{campus?.name}</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={3} style={{ margin: "10px 0" }}>
            {campus?.name}
          </Title>
          <Row>
            <Space size={"middle"}>
              <span>Địa chỉ: </span>
              <b style={{ fontSize: 16 }}>
                {campus?.street}, {campus?.ward}, {campus?.district}, {campus?.city}
              </b>
            </Space>
          </Row>
          <Row>
            <Space size={"middle"}>
              <span>Quản trị viên:</span>
              <b style={{ fontSize: 16 }}>
                {campus?.admin_id} - {campus?.admin_name}
              </b>
            </Space>
          </Row>
          <Tabs defaultActiveKey="students">
            <Tabs.TabPane tab="Học sinh" key="students">
              <CampusStudents campusId={campusId} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Giáo viên" key="teachers">
              <CampusTeachers campusId={campusId} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      }
    />
  );
}

export default CampusDetail;
