import React from "react";
import { Card, Col, Empty, Row } from "antd";
import * as SC from "../../CustomButton/styled";
import "./card-teacher.scss";
import { Link } from "react-router-dom";
import { CalendarOutlined } from "@ant-design/icons";

export default function ClassesTeacher({ classes }) {
  return (
    <div className="site-card-wrapper">
      <Row gutter={[10, 30]} justify="flex-left" align="middle">
        {classes.length === 0 ? (
          <Empty />
        ) : (
          classes.map((item) => {
            return (
              <Col key={item.id} xs={24} sm={12} md={12} lg={12} xl={12}>
                <Card title={item.name} bordered={true}>
                  <pre>
                    <CalendarOutlined />{" "}
                    <span>
                      {item.semester_name} - {item.year}
                    </span>
                  </pre>
                  <pre>
                    <i className="fas fa-user-tie"></i>{" "}
                    <span>GVCN: {item.form_teacher_name !== null ? item.form_teacher_name : "Chưa có"}</span>
                  </pre>
                  <pre>
                    <i className="fas fa-layer-group"></i> <span>{item.grade_name}</span>
                  </pre>
                  <pre>
                    <i className="fas fa-users"></i> <span>{item.student_count} học sinh</span>
                  </pre>
                  <Link to={`lessons?classId=${item.id}`}>
                    <SC.btnBlue>Truy Cập</SC.btnBlue>
                  </Link>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </div>
  );
}
