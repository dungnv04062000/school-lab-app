import React, { useState } from "react";
import { Col, Row, Layout } from "antd";
import "./showInfor.scss";
import FormInfor from "../../../components/common/form/Form-Infor/index";
import FormAvatar from "../../../components/common/form/form-avatar";
import AppHeader from "../../../components/common/header/guest/headerMain";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../../redux/selector";
import LayoutHomeList from "../../../components/layouts/mainLayout";

const { Header, Content } = Layout;

export default function UserProfile() {
  const userInfo = useSelector(userInfoSelector);

  document.title = "Thông tin cá nhân";
  return (
    <LayoutHomeList
      content={
        <div className="main">
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={9} className="show-avatar">
              <FormAvatar user={userInfo} />
            </Col>
            <Col xs={24} sm={24} md={15} className="show-infor-account">
              <FormInfor user={userInfo} />
            </Col>
          </Row>
        </div>
      }
    />
  );
}
