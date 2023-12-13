import React, { useState } from "react";
import { Avatar, Col, Menu, Row, Modal, Drawer, Button, Tag } from "antd";
import "./style.scss";
import { UserOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import DropdownSection from "../../dropdown/dropdown-section";
import { ContactsFilled, FileAddFilled, LoginOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "../../../../redux/slices/authSlice";
import * as SC from "../../CustomButton/styled";
import * as S3 from "../../../../util/S3Host";
import { userInfoSelector } from "../../../../redux/selector";

export default function UserHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    navigate("/signin");
  };

  const menuSection = (
    <Menu
      items={[
        {
          key: "profile",
          label: (
            <Link to="/profile">
              <div className="dropdown-item-section">
                <ContactsFilled style={{ color: "#b7b7b7", fontSize: "25px", padding: "5px 0" }} />{" "}
                <big>Hồ sơ của tôi</big>
              </div>
            </Link>
          )
        },
        {
          key: "supports",
          label: (
            <Link to="/requests">
              <div className="dropdown-item-section">
                <QuestionCircleOutlined style={{ color: "#b7b7b7", fontSize: "25px", padding: "5px 0" }} />{" "}
                <big>Yêu cầu đã gửi</big>
              </div>
            </Link>
          )
        },
        {
          key: "notes",
          label: (
            <Link to="/notes">
              <div className="dropdown-item-section">
                <FileAddFilled style={{ color: "#b7b7b7", fontSize: "25px" }} /> <big>Ghi chú</big>
              </div>
            </Link>
          )
        },
        {
          key: "logout",
          label: (
            <div className="dropdown-item-section" onClick={handleLogout}>
              <LoginOutlined style={{ color: "#b7b7b7", fontSize: "25px", padding: "5px 0" }} /> <big>Đăng xuất</big>
            </div>
          )
        }
      ]}
    />
  );

  const menuSchoolAdminSection = (
    <Menu
      items={[
        {
          key: "profile",
          label: (
            <Link to="/profile">
              <div className="dropdown-item-section">
                <ContactsFilled style={{ color: "#b7b7b7", fontSize: "25px", padding: "5px 0" }} />{" "}
                <big>Hồ sơ của tôi</big>
              </div>
            </Link>
          )
        },
        {
          key: "supports",
          label: (
            <Link to="/requests">
              <div className="dropdown-item-section">
                <QuestionCircleOutlined style={{ color: "#b7b7b7", fontSize: "25px", padding: "5px 0" }} />{" "}
                <big>Yêu cầu đã gửi</big>
              </div>
            </Link>
          )
        },
        {
          key: "logout",
          label: (
            <div className="dropdown-item-section" onClick={handleLogout}>
              <LoginOutlined style={{ color: "#b7b7b7", fontSize: "25px", padding: "5px 0" }} /> <big>Đăng xuất</big>
            </div>
          )
        }
      ]}
    />
  );
  const menuRootAdminSection = (
    <Menu
      items={[
        {
          key: "profile",
          label: (
            <Link to="/profile">
              <div className="dropdown-item-section">
                <ContactsFilled style={{ color: "#b7b7b7", fontSize: "25px", padding: "5px 0" }} />{" "}
                <big>Hồ sơ của tôi</big>
              </div>
            </Link>
          )
        },
        {
          key: "logout",
          label: (
            <div className="dropdown-item-section" onClick={handleLogout}>
              <LoginOutlined style={{ color: "#b7b7b7", fontSize: "25px", padding: "5px 0" }} /> <big>Đăng xuất</big>
            </div>
          )
        }
      ]}
    />
  );

  // const [openDrawer, setOpenDrawer] = useState(false);
  // const showDrawer = () => {
  //   setOpenDrawer(true);
  // };
  // const onClose = () => {
  //   setOpenDrawer(false);
  // };

  // const [openModal, setOpenModal] = useState(false);
  // const showModal = () => {
  //   setOpenModal(true);
  //   setOpenDrawer(false);
  // };
  // const handleCancel = () => {
  //   setOpenModal(false);
  // };

  const userInfo = useSelector(userInfoSelector);

  return (
    <div className="header-account">
      {/* <Modal open={openModal} title="Thông tin yêu cầu hỗ trợ" onCancel={handleCancel} footer={false}>
        <FormSupport onClickCancle={handleCancel} user={userInfo} onCancel={handleCancel} />
      </Modal> */}
      <>
        <Row gutter={[5, 0]} justify="start" align="middle" className="btn-header">
          {/* <Col onClick={showModal} className="right-nav-item">
              Hỗ trợ
            </Col>
            <Col className="right-nav-item">Hướng dẫn</Col> */}
          <Col className="right-nav-item">
            <Tag color="#0097c9">
              {userInfo?.id} - {userInfo?.first_name + " " + userInfo?.last_name}
            </Tag>
          </Col>
          {!userInfo?.roles.includes("ROOT_ADMIN") && (
            <Col className="right-nav-item">
              <Tag color="#0097c9">Campus: {userInfo?.campus_name}</Tag>
            </Col>
          )}
        </Row>
        {/* <Button className="barsMenu" onClick={showDrawer}>
            <MenuUnfoldOutlined />
          </Button>
          <Drawer width="45%" title="School LAB" placement="right" onClose={onClose} open={openDrawer}>
            <p onClick={showModal}>Hỗ trợ</p>
            <Link to="#">Hướng dẫn</Link>
          </Drawer> */}
      </>
      <div className="section">
        {/* <DropdownSection
          menuSec={menuNotify}
          content={
            <>
              <Badge count={3}>
                <Avatar icon={<BellOutlined />} />
              </Badge>
            </>
          }
        /> */}
        <DropdownSection
          menuSec={
            userInfo?.roles.includes("ROOT_ADMIN")
              ? menuRootAdminSection
              : userInfo?.roles.includes("SCHOOL_ADMIN")
              ? menuSchoolAdminSection
              : menuSection
          }
          content={
            <>
              {userInfo?.image_url ? (
                <Avatar src={`${S3.HOST}${userInfo?.image_url}`} />
              ) : (
                <Avatar icon={<UserOutlined />} />
              )}
            </>
          }
        />
      </div>
    </div>
  );
}
