import React from "react";
import { Card, Col, Empty, Row } from "antd";
import * as SC from "../../CustomButton/styled";
import "./card-student.scss";
import { Link } from "react-router-dom";

export default function StudentSubjectList({ subjects }) {
  return (
    <div className="site-card-wrapper">
      <Row gutter={[10, 30]} justify="space-between" align="middle">
        {subjects.length === 0 ? (
          <Empty style={{ margin: "0 auto" }} />
        ) : (
          subjects.map((subject) => {
            return (
              <Col key={subject.id} xs={24} sm={12} md={12} lg={12}>
                <Card title={subject.name} bordered={true}>
                  <pre>
                    <i className="fas fa-book-open"></i> <span>{subject.lesson_count} dự án</span>
                  </pre>
                  <Link to={`/student/lessons?subjectId=${subject.id}`}>
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
