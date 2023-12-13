import React, { useState } from "react";
import "./headerMain.scss";
import { Link } from "react-router-dom";
import * as SC from "../../CustomButton/styled";
import LogoHeader from "../../logo/logo";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../../../redux/selector";
import UserHeader from "../user/headerHome";
import NavbarHeader from "../../Navbar";
import { Button, Col, Drawer, Modal, Row } from "antd";
import { MenuUnfoldOutlined, HomeOutlined, LoginOutlined } from "@ant-design/icons";
import FormSupport from "../../form/form-support";

function AppHeaderMain() {
  const userInfo = useSelector(userInfoSelector);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [openModal, setOpenModal] = useState(false);
  const showModal = () => {
    setOpenModal(true);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <div className="container-fluid">
      <div className="header">
        <div className="logo">
          <Link to="/">
            <LogoHeader />
          </Link>
        </div>
        <NavbarHeader />
        {userInfo == null ? (
          <>
            <Modal open={openModal} title="Thông tin yêu cầu hỗ trợ" onCancel={handleCancel} footer={false}>
              <FormSupport onClickCancle={handleCancel} user={userInfo} onCancel={handleCancel} />
            </Modal>
            <div className="btn-header">
              <Row justify="start" align="middle" className="btn-support">
                <SC.btnWhite onClick={showModal}>Hỗ trợ</SC.btnWhite>
              </Row>
              <Link to="/signin" className="btn-header-item">
                <SC.btnBlue>Đăng Nhập</SC.btnBlue>
              </Link>
            </div>
            <Button className="barsMenu" onClick={showDrawer}>
              <MenuUnfoldOutlined />
            </Button>
            <Drawer width="45%" title="School LAB" placement="right" onClose={onClose} open={open}>
              <Link to="/signin">
                <LoginOutlined /> Đăng nhập
              </Link>
            </Drawer>
          </>
        ) : (
          <UserHeader />
        )}
      </div>
    </div>
  );
}

export default AppHeaderMain;
