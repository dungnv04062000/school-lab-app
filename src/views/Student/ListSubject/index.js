import React, { useEffect, useState } from "react";
import StudentSubjectList from "../../../components/common/Card/card-student";
import LayoutHomeList from "../../../components/layouts/mainLayout/index";
import * as SC from "../../../components/common/CustomButton/styled";
import { Col, Form, Input, Row } from "antd";
import "./list-subject.scss";
import BaseAPI from "../../../util/BaseAPI";

export default function StudentListSubject() {
  const [subjectName, setSubjectName] = useState("");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getSubjects();
  }, []);

  const onSearch = (values) => {
    getSubjects();
  };

  const handleSearchSubject = (e) => {
    setSubjectName(e.target.value);
  };

  const getSubjects = () => {
    let response = BaseAPI.get("/student-subjects", {
      params: {
        subject_name: subjectName?.trim()
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setSubjects(res.data.items);
        } else {
          setSubjects([]);
        }
      })
      .catch((err) => {
        setSubjects([]);
      });
  };

  document.title = `Danh sách môn học`;
  return (
    <div>
      <LayoutHomeList
        content={
          <div className="subjects-wrapper">
            <div className="filter">
              <Form onFinish={onSearch}>
                <Row gutter={[10, 10]} align="bottom">
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <label>Tên môn học</label>
                    <Form.Item>
                      <Input size="large" onChange={handleSearchSubject} value={subjectName} />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item>
                      <SC.btnWhite>Tìm kiếm</SC.btnWhite>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
            <StudentSubjectList subjects={subjects} />
          </div>
        }
      />
    </div>
  );
}
