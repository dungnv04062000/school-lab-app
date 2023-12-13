import { Col, Row } from "antd";
import React from "react";
import image1 from "../../../assets/images/STEM.png";
import "./infor.scss";

export default function AppInfor() {
  return (
    // <div className='block inforBlock'>
    <Row gutter={[20, 0]} className="inforBlock">
      <Col xl={16} lg={12} xs={24} sm={24} md={24}>
        <h1>Đặc điểm của mô hình giáo dục STEM</h1>
        <p style={{ maxWidth: 1000 }}>
          Trong các diễn đàn học thuật nghiên cứu về <b>giáo dục STEM</b> các học giả vẫn tiếp tục tranh luận về khía
          cạnh triển khai của mô hình <b>giáo dục STEM</b> này. Chẳng hạn: Như thế nào là cách tiếp cận liên ngành trong
          một chương trình học? Dạy về công nghệ như thế nào? Để làm rõ vấn đề này, tổ chức các nhà nghiên cứu giáo dục
          khoa học Mỹ (<i>National Association for Research in Science Teaching- NARST</i>) <b>năm 2012</b> đã đưa ra
          các thuật ngữ về giáo dục STEM chi tiết hơn, giúp tránh nhầm lẫn với các khái niệm các ngành nghề trong lĩnh
          vực STEM, đó là <b>STEM Integration</b> (<i>tích hợp STEM</i>), hay <b>Integrated STEM education</b> (
          <i>giáo dục STEM tích hợp</i>) hoặc
          <b>STEM- focused curriculum</b> (<i>chương trình học tập chung về STEM</i>). Tổng hợp các nghiên cứu và báo
          cáo gần đây nêu ra 5 đặc điểm chính của giáo dục STEM để phân biệt với các chương trình khác:
        </p>
        <div className="signin-text">
          <h3>1. Tập chung vào sự tích hợp</h3>
        </div>
        <div className="signin-text">
          <h3>2. Liên hệ với cuộc sống thực</h3>
        </div>
        <div className="signin-text">
          <h3>3. Hướng đến phát triển kỹ năng của thế kỷ 21</h3>
        </div>
        <div className="signin-text">
          <h3>4. Thách thức học sinh vượt lên chính mình</h3>
        </div>
        <div className="signin-text">
          <h3>5. Có tính hệ thống và gắn kết giữa đa dạng các bài học.</h3>
        </div>
      </Col>
      <Col className="join-image" xl={8} lg={12} xs={24} sm={24} md={24}>
        <img src={image1} alt="join-image" />
      </Col>
    </Row>
    // </div>
  );
}
