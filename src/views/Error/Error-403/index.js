import React from "react";
import * as SC from "../../../components/common/CustomButton/styled";
import "./pageForBidden.scss";
import image from "../../../assets/images/page-403.png";
import { useNavigate } from "react-router-dom";
import { Row } from "antd";

export default function PageForbidden() {
  const navigate = useNavigate();

  document.title = "Oops! Không thể truy cập";
  return (
    <div className="pageforbidden">
      <img src={image} alt="page forbidden" />
      <h1>Oops ...</h1>
      <div className="text">Trang bạn đang cố truy cập đã bị hạn chế quyền truy cập</div>
      <div className="text">Vui lòng tham khảo quản trị viên hệ thống của bạn</div>
      <SC.btnWhite onClick={() => navigate("/")} style={{ marginTop: 20 }}>
        Trang chủ
      </SC.btnWhite>
    </div>
  );
}
