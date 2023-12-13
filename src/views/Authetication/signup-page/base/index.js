import { Col, Row } from "antd";
import React, { useState } from "react";
import "./style.scss";
import SignUpData from "./Signup-email";

import { Layout } from "antd";
import AppHeaderMain from "../../../../components/common/header/for-main/headerMain";
import LogoFooter from "../../../../components/common/logo/logo-footer";
const { Header, Content } = Layout;

export default function SignUpForm() {
  return (
    <Layout className="mainLayout">
      <div className="main">
        <Header>
          <AppHeaderMain />
        </Header>
        <Content>
          <Row gutter={[16, 16]} className="sign-up">
            <Col xs={24} sm={12} md={10} className="signup__logo">
              <h1>
                <LogoFooter />
              </h1>
            </Col>
            <Col xs={24} sm={12} md={14} className="signup__form-data">
              <SignUpData />
            </Col>
          </Row>
        </Content>
      </div>
    </Layout>
  );
}
