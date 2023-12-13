import React, { useState } from "react";
import { BackTop, Col, Modal, Row } from "antd";
import "./footer.scss";
import LogoFooter from "../logo/logo-footer.js";
import { Link } from "react-router-dom";
import FormSupport from "../form/form-support";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../../redux/selector";

function AppFooter() {
  const [openModal, setOpenModal] = useState(false);
  const showModal = () => {
    setOpenModal(true);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };
  const userInfo = useSelector(userInfoSelector);
  return (
    <Row className="footer">
      <Modal open={openModal} title="Thông tin yêu cầu hỗ trợ" onCancel={handleCancel} footer={false}>
        <FormSupport onClickCancle={handleCancel} user={userInfo} onCancel={handleCancel} />
      </Modal>
      <Col className="footer-logo" xs={24} sm={24} md={12}>
        <Row className="logo">
          <Link to={"/"}>
            <LogoFooter />
          </Link>
        </Row>
        <div className="social">
          <p>Thực hành để tiến xa hơn</p>
          <span>
            <i className="fab fa-facebook"></i>
          </span>
          <span>
            <i className="fab fa-instagram"></i>
          </span>
          <span>
            <i className="fab fa-linkedin"></i>
          </span>
        </div>
        <div className="copyright">
          <p>© 2022 Single Best Answer. All Rights Reserved.</p>
          <BackTop style={{ color: "black" }}>
            <div className="goTop">
              <i className="fas fa-arrow-circle-up"></i>
            </div>
          </BackTop>
        </div>
      </Col>
      <Col className="footer-my-account" xs={24} sm={24} md={4}>
        <h3 className="footer-title">Thông tin</h3>
        <p>Về chúng tôi</p>
        {!userInfo?.roles.includes("ROOT_ADMIN") && <p onClick={showModal}>Hỗ trợ</p>}
        <p>
          <a
            target={"_blank"}
            href="https://docs.google.com/document/d/1x18TZPwjWZJbDdrTetTMSuTbYktuJtLm/edit?usp=share_link&ouid=106080816218303310365&rtpof=true&sd=true"
          >
            Hướng dẫn
          </a>
        </p>
      </Col>
      <Col className="footer-about" xs={24} sm={24} md={8}>
        <h3 className="footer-title">Liên lạc</h3>
        <p>
          <i className="fas fa-map-marker-alt"></i>Đại học FPT, km 29 Đại Lộ Thăng Long, Khu CNC Hòa Lạc, Thạch Thất, Hà
          Nội
        </p>
        <pre>
          <i className="far fa-envelope"></i> hotro.schoollab@gmail.com
        </pre>
        <pre>
          <i className="fas fa-phone-alt"></i>0859094608
        </pre>
      </Col>
    </Row>
  );
}

export default AppFooter;
