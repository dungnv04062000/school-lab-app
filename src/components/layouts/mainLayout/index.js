import React from "react";
import { Layout } from "antd";
import "./main-layout.scss";
import AppHeader from "../../common/header/guest/headerMain";
import AppFooter from "../../common/footer/footer";
const { Header, Content, Footer } = Layout;

export default function LayoutHomeList(props) {
  const { content } = props;
  return (
    <Layout className="mainLayout">
      <Header>
        <AppHeader />
      </Header>
      <Content>
        <div className="home-content">{content}</div>
      </Content>
      <Footer style={{ marginTop: 50 }}>
        <AppFooter />
      </Footer>
    </Layout>
  );
}
