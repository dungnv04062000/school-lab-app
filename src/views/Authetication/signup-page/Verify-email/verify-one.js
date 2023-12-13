import { Steps } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import imageVerify from "../../../../../src/assets/images/verify-one.png";
import * as SC from "../../../../components/common/CustomButton/styled";
import "./verify.scss";
const { Step } = Steps;
const steps = [
  {
    title: "",
    content: (
      <div className="verify-form-one">
        <div className="verify-text">
          <div>Một bước nữa thôi</div>
          <br />
          <div>Vui lòng kiểm tra email và bấm vào liên kết để hoàn tất đăng kí</div>
          <img src={imageVerify} alt="Verify Email" />
        </div>
      </div>
    )
  },
  {
    title: "",
    content: ""
  }
];

export default function VerifyOne() {
  document.title = "Xác nhận đăng ký";
  const [current, setCurrent] = useState(0);

  return (
    <SC.BackgroundMain>
      <StepForm>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <StepContent>{steps[current].content}</StepContent>
      </StepForm>
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
