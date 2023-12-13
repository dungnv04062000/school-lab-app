import React, { useEffect } from "react";
import AppAbout from "../components/home/about/about";
import AppJoin from "../components/home/join/join";
import AppInfor from "../components/home/infor/infor";

import AppFooter from "../components/common/footer/footer";
import { Layout } from "antd";
import AppHeaderMain from "../components/common/header/guest/headerMain";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userInfoSelector } from "../redux/selector";
const { Header, Content, Footer } = Layout;

export default function Main() {
  const userInfo = useSelector(userInfoSelector);
  const navigate = useNavigate();

  useEffect(() => {
    //nếu đã có tt user thì đẩy về trang ...
    if (userInfo) {
      const roles = userInfo?.roles;
      if (roles.includes("STUDENT")) {
        navigate("/student/subjects");
      } else if (roles.includes("ROOT_ADMIN")) {
        navigate("/supports");
      } else if (roles.includes("SCHOOL_ADMIN")) {
        navigate("/school-admin");
      } else if (roles.includes("TEACHER")) {
        navigate("/teacher/classes");
      } else {
        navigate("/form-teacher/students");
      }
    }
  }, [userInfo]);

  document.title = "SchoolLab - Trang chủ";
  return (
    <Layout className="mainLayout">
      <div className="main">
        <Header>
          <AppHeaderMain />
        </Header>
        <Content>
          <AppJoin />
          <AppAbout />
          <AppInfor />
        </Content>
        <Footer>
          <AppFooter />
        </Footer>
      </div>
    </Layout>
  );
}
