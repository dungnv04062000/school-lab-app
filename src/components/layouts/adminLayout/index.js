import React from "react";
import { Layout } from "antd";
import AppFooter from "../../common/footer/footer";
import AppHeaderMain from "../../common/header/guest/headerMain";
const { Header, Content, Footer } = Layout;

export default function LayoutHomeAdmin(props) {
  const { menuSection, content } = props;
  return (
    <Layout className="mainLayout">
      <Header>
        <AppHeaderMain menuSection={menuSection} />
      </Header>
      <Content>
        <div className="home-content">{content}</div>
      </Content>
      <Footer>
        <AppFooter />
      </Footer>
    </Layout>
  );
}
