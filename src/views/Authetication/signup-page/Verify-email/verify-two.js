import { Button, message, Steps } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import VerifySuccessful from "../../../../../src/assets/images/vectorVerify.png";
import verifyFailed from "../../../../../src/assets/images/btnDelete.png";
import * as SC from "../../../../components/common/CustomButton/styled";
import "./verify.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../components/common/loading/fullscreenLoading/index";
import BaseAPI from "../../../../util/BaseAPI";

const { Step } = Steps;
const successStep = [
  {
    title: "",
    content: (
      <div className="verify-form-one">
        <div className="verify-text">
          <img src={verifyFailed} alt="Verify Email" />
          <p style={{ marginTop: 15 }}>Có lỗi xảy ra</p>
        </div>
      </div>
    )
  },
  {
    title: "",
    content: (
      <div className="verify-form-one">
        <div className="verify-text">
          <img src={VerifySuccessful} alt="Verify Email" />
          <div>Hoàn tất đăng kí</div>
          <br />
          <div>Chào mừng bạn đến bạn đến với School Lab</div>
        </div>
      </div>
    )
  }
];

export default function VerifyTwo() {
  const [loading, setLoading] = useState(true);
  const [verifyError, setVerifyError] = useState(false);
  const queryString = useLocation().search;
  const userId = new URLSearchParams(queryString).get("userId");

  useEffect(() => {
    const res = BaseAPI.post(`/auth/verify-accounts/${userId}`);
    res
      .then((res) => {
        if (res?.status === 200) {
          document.title = "Xác thực thành công";
          setLoading(false);
        } else {
          document.title = "Lỗi!!!";
          setLoading(false);
          setVerifyError(true);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        setVerifyError(true);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  }, []);

  const current = verifyError ? 0 : 1;
  const navigate = useNavigate();

  const handleFinishSignup = () => {
    if (!verifyError) {
      message.success("Hoàn tất đăng kí!");
    }
    navigate("/signin");
  };

  return (
    <SC.BackgroundMain>
      <StepForm>
        <Steps current={1}>
          {successStep.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <StepContent>{successStep[current].content}</StepContent>

        <div style={{ margin: "15px 0" }}>
          <SC.btnGreen onClick={handleFinishSignup} style={{ display: "block", margin: "0 auto" }}>
            Đăng nhập
          </SC.btnGreen>
        </div>
      </StepForm>
      {loading && <Loading />}
    </SC.BackgroundMain>
  );
}

const StepForm = styled.div`
  width: 40%;
  margin: 0 auto;
  border: 2px solid white;
  background-color: white;
  padding: 20px;
  border-radius: 20px;
`;

const StepContent = styled.div`
  min-height: 200px;
  margin-top: 16px;
  padding-top: 80px;
  text-align: center;
  background-color: #fafafa;
  border: 2px dashed #e9e9e9;
  border-radius: 10px;
`;

const StepAction = styled.div`
  margin-top: 5%;
  margin-left: 40%;
`;
