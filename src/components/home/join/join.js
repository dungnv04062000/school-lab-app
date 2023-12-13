import React from "react";
import "./join.scss";
import { Carousel } from "antd";
import * as SC from "../../common/CustomButton/styled";

const items = [
  {
    key: "1",
    title: "Giáo dục STEM là gì?",
    content:
      "<b>Giáo dục STEM</b> (<i>STEM education</i>) là một cách tiếp cận liên ngành trong quá trình học, trong đó các khái niệm học thuật mang tính nguyên tắc được lồng ghép với các bài học trong thế giới thực, ở đó các bạn học sinh được áp dụng kiến thức và kỹ năng trong các lĩnh vực <b>khoa học, công nghệ, kỹ thuật</b> và <b>toán học</b> vào trong các bối cảnh cụ thể, giúp kết nối giữa trường học, cộng đồng, nơi làm việc và các tổ chức toàn cầu, được truyền đạt đan xen và kết dính lẫn nhau cho học sinh trên cơ sở học thông qua thực hành và hướng đến giải quyết các vấn đề thực tiễn. Ngoài ra, <b>giáo dục STEM</b> còn chú trọng trang bị cho học sinh những kỹ năng mềm cần thiết cho sự thành công trong công việc sau này như kỹ năng cộng tác, làm việc nhóm, giải quyết vấn đề, tư duy sáng tạo, tư duy phản biện…"
  },
  {
    key: "2",
    title: "Dạy học các môn học theo phương pháp giáo dục STEM",
    content:
      "Đây là hình thức tổ chức giáo dục STEM chủ yếu trong nhà trường. Theo cách này, các bài học, hoạt động <b>giáo dục STEM</b> được triển khai ngay trong quá trình dạy học các <b>môn học STEM</b> theo tiếp cận liên môn. Các <b>chủ đề STEM, bài học STEM, hoạt động STEM</b> bám sát chương trình của các môn học thành phần. Hình thức giáo dục STEM này không làm phát sinh thêm thời gian học tập."
  },
  {
    key: "3",
    title: "Tổ chức các hoạt động trải nghiệm trong chương trình giáo dục STEM",
    content:
      "Trong hoạt động trải nghiệm STEM, học sinh được khám phá các ứng dụng <b>khoa học, kỹ thuật</b> trong thực tiễn đời sống. Qua đó, nhận biết được ý nghĩa của <b>khoa học, công nghệ, kỹ thuật và toán học</b> đối với đời sống con người, nâng cao hứng thú học tập các <b>môn học STEM</b>. Đây cũng là cách thức để thu hút sự quan tâm của xã hội tới <b>giáo dục STEM</b>.<br/>Để tổ chức thành công các hoạt động trải nghiệm STEM, cần có sự tham gia, hợp tác của các bên liên quan như trường trung học, cơ sở giáo dục nghề nghiệp, các trường đại học, doanh nghiệp. <b>Trải nghiệm STEM</b> còn có thể được thực hiện thông qua sự hợp tác giữa trường trung học với các cơ sở giáo dục đại học, giáo dục nghề nghiệp. Theo cách này, sẽ kết hợp được thực tiễn phổ thông với ưu thế về cơ sở vật chất của giáo dục đại học và giáo dục nghề nghiệp.<br/>Các trường trung học có thể triển khai giáo dục STEM thông qua hình thức <b>câu lạc bộ STEM</b>. Tham gia câu lạc bộ STEM, học sinh được học tập nâng cao trình độ, triển khai các dự án nghiên cứu, tìm hiểu các ngành nghề thuộc <b>lĩnh vực STEM</b>. Đây là hoạt động theo sở thích, năng khiếu của học sinh."
  }
];

function AppJoin() {
  return (
    <div id="join" className="joinBlock md-2">
      <Carousel>
        {items.map((item) => {
          return (
            <div key={item.key} className="carousel">
              <div className="content">
                <h3>{item.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

export default AppJoin;
