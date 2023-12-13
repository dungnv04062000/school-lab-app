import React, { useState } from "react";
import { Col, Form, Input, message, Row, Select, Tabs, Typography } from "antd";
import TableClasses from "../../../components/common/table/table-admin/manager-class";
import * as SC from "../../../components/common/CustomButton/styled";
import TableAdManagerTeacher from "../../../components/common/table/table-admin/manager-teacher";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import { useSelector } from "react-redux";
import { semestersSelector, userInfoSelector } from "../../../redux/selector";
import TableAdManagerStudent from "../../../components/common/table/table-admin/manager-student";
import TableSemesters from "../../../components/common/table/table-admin/manage-semester";
import "./style.scss";

const { Title } = Typography;
const { Option } = Select;

export default function SchoolAdminDashboard() {
  const userInfo = useSelector(userInfoSelector);

  const semesters = useSelector(semestersSelector);
  const [semesterId, setSemesterId] = useState(semesters[0]?.id);

  const handleSemesterChange = (value) => {
    setSemesterId(value);
  };

  document.title = userInfo?.campus_name || "Quản trị viên trường học";
  return (
    <LayoutHomeList
      content={
        <div className="school-admin-wrapper">
          <Title level={3}>
            <span>
              <i className="fas fa-school"></i> {userInfo.campus_name}
            </span>
            <br />
          </Title>
          <div className="manage-student">
            <Title level={2}>Quản trị viên</Title>
            <Row gutter={[10, 10]} align="bottom">
              <Col xl={5} lg={6} md={8} sm={12} xs={24}>
                <Form.Item>
                  <label>Học kỳ</label>
                  <Select
                    defaultValue={semesterId}
                    size="large"
                    onChange={handleSemesterChange}
                    placeholder="Chọn học kỳ"
                  >
                    {semesters.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name} - {item.year}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Tabs defaultActiveKey="classes">
              <Tabs.TabPane tab="Lớp học" key="classes">
                <div className="manager-class">
                  <TableClasses semesterId={semesterId} />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Giáo viên" key="teachers">
                <div className="manager-teacher">
                  <TableAdManagerTeacher semesterId={semesterId} />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Học sinh" key="students">
                <div className="manager-student">
                  <TableAdManagerStudent semesterId={semesterId} />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Học kỳ" key="semesters">
                <div className="manager-semester">
                  <TableSemesters />
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      }
    />
  );
}
