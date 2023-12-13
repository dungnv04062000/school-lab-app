import React from "react";
import ImgBack from "../../../assets/images/hyperautomation.png";
import "./about.scss";

import { Row, Col } from "antd";

const items = [
  {
    key: "1",
    title: "1",
    content: "Xây dựng những năng lực nhận thức STEM cho thể hệ công dân tương lai"
  },
  {
    key: "2",
    title: "2",
    content: "Chuẩn bị những năng lực cần thiết cho nguồn lực lao động trong thế kỷ 21"
  },
  {
    key: "3",
    title: "3",
    content: "Tập trung nghiên cứu, phát triển và đổi mới trong lĩnh vực giáo dục ngành nghề STEM."
  }
];

function AppAbout() {
  return (
    <div id="about" className="block aboutBlock">
      <div className="container-fluid">
        <div className="titleHolder">
          <h2>Mục tiêu của giáo dục STEM</h2>
        </div>
        <div className="contentHolder">
          <p>
            Theo các báo cáo tại diễn đàn <b>giáo dục STEM</b> gần đây, đặc biết trong cuốn sách bàn về{" "}
            <b>giáo dục STEM</b> của Mỹ (<i>tác giả Rodger Bybee, 2018</i>). Ở <b>Mỹ, giáo dục STEM</b> có thể được xếp
            vào <b>3</b> nhóm mục tiêu chính như sau:
          </p>
        </div>
        <Row style={{ margin: "0 5%" }}>
          {items.map((item) => {
            return (
              <Col xs={24} sm={24} md={8} key={item.key} className="content">
                {/* <div className="content"> */}
                <h2>{item.title}</h2>
                <h3>{item.content}</h3>
                {/* </div> */}
              </Col>
            );
          })}
        </Row>
      </div>
      <img className="img-back" src={ImgBack} alt="" />
    </div>
  );
}

export default AppAbout;
