import React from "react";
import * as SC from "../../../components/common/CustomButton/styled";
import image from "../../../assets/images/page-404.png";
import "./pageNotFound.scss";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  document.title = "Oops! Không tìm thấy trang này";
  return (
    <div className="pagenotfound">
      <img src={image} alt="Page not found ... " />
      <h1>Page Not Found ... </h1>
      <SC.btnGreen onClick={() => navigate(-1)}>Quay lại</SC.btnGreen>
    </div>
  );
}
