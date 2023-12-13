import styled from "styled-components";

const btnGreen = styled.button`
  background: linear-gradient(90deg, #136cb5 0%, #49bbbd 100%);
  border-radius: 5px;
  border: none;
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s linear;
  &:hover {
    background-color: #45b5bc;
    color: white;
  }
`;

const btnBlue = styled.button`
  background-color: #1ba4d6;
  border-radius: 5px;
  border: none;
  padding: 10px 15px;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s linear;
  &:hover {
    background-color: #16799e;
  }
`;

const btnWhite = styled.button`
  background-color: white;
  white-space: nowrap;
  border-radius: 5px;
  border: 1px solid #45b5bc;
  padding: 8px 15px;
  color: #45b5bc;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover {
    background-color: #45b5bc;
    color: white;
  }
`;
const btnLightGreen = styled.button`
  background-color: #6bd6d8;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s linear;

  &:hover {
    background-color: #45b5bc;
  }
`;

const btnCancel = styled.span`
  background-color: #adadad;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s linear;

  &:hover {
    background-color: #666;
  }
`;
const btnGray = styled.button`
  background-color: #adadad;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s linear;

  &:hover {
    background-color: #666;
  }
`;
const btnDisable = styled.button`
  background-color: #adadad;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 10px 15px;
  cursor: not-allowed;
  white-space: nowrap;
  transition: all 0.1s linear;
`;

const btnRed = styled.button`
  background-color: #ff6969;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 10px 15px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover {
    background-color: #f73155;
  }
`;
const btnGreenLight = styled.button`
  background-color: #65ea62;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s linear;

  &:hover {
    background-color: #4bbc47;
  }
`;

const BackgroundMain = styled.div`
  height: 100vh;
  width: 100vw;
  //màu nền mặc định
  background: linear-gradient(50deg, #edd7ff 10%, #d8e7ff 70%);
  padding-top: 70px;
`;

export {
  btnRed,
  btnGray,
  btnGreen,
  btnLightGreen,
  btnWhite,
  btnGreenLight,
  btnBlue,
  BackgroundMain,
  btnCancel,
  btnDisable
};
