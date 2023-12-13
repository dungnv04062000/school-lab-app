import React, { useEffect, useState } from "react";
import { Col, Form, Layout, Radio, Row, Select, message } from "antd";
import "./style.scss";
import AppHeaderMain from "../../../../../components/common/header/guest/headerMain";
import * as SC from "../../../../../components/common/CustomButton/styled";
import { useNavigate } from "react-router-dom";
import BaseAPI from "../../../../../util/BaseAPI";
import { useDispatch } from "react-redux";
import authSlice from "../../../../../redux/slices/authSlice";
const { Option } = Select;

const { Header, Content } = Layout;
// const plainOptionsRole = ["Học sinh", "Giáo viên"];

export default function SignupRoleCampus() {
  document.title = "Đăng ký tài khoản";

  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [campusId, setCapmusId] = useState();

  const [campuses, setCampuses] = useState([]);
  useEffect(() => {
    const campusResponse = BaseAPI.get("/campuses");
    campusResponse
      .then((res) => {
        if (res?.status === 200) {
          setCampuses([...res.data.items]);
        } else {
          message.error("Có lỗi xảy ra");
        }
      })
      .catch((err) => message.error(err?.response?.data?.message || "Có lỗi xảy ra"));
  }, []);

  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(
      authSlice.actions.setRoleAndCampus({
        role: role,
        campusId: campusId
      })
    );
    navigate("/signup");
  };

  const handleChangeSelect = (value) => {
    setCapmusId(value);
  };
  const handleChangeRole = ({ target: { value } }) => {
    setRole(value);
  };

  return (
    <Layout className="mainLayout">
      <div className="main">
        <Header>
          <AppHeaderMain />
        </Header>
        <Content>
          <Row className="sign-up">
            <Col span={24} className="signup__form-data">
              <h3>Hãy chọn Vai trò và Campus của bạn</h3>
              <Form
                name="sign-role-campus"
                initialValues={{ remember: true }}
                className="form-data"
                onFinish={onFinish}
              >
                <Row gutter={[10, 10]} justify="center" align="middle">
                  <Col xl={8} lg={8} md={16} xs={16}>
                    <label>Vai trò</label>
                    <Form.Item name="vai trò">
                      <div className="radio-option">
                        <Radio.Group onChange={handleChangeRole} style={{ border: "none" }} defaultValue="student">
                          <Radio value="student">Học sinh</Radio>
                          <Radio value="teacher">Giáo viên</Radio>
                        </Radio.Group>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[10, 10]} justify="center" align="middle">
                  <Col xl={8} lg={8} md={16} xs={16}>
                    <label>Campus</label>
                    <Form.Item
                      name="campus"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn campus"
                        }
                      ]}
                    >
                      <Select onChange={handleChangeSelect} size="large">
                        {campuses.map((item) => {
                          return (
                            <Option key={item.id} value={item.id}>
                              {item.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[10, 10]} justify="center">
                  <Col>
                    <SC.btnGray
                      onClick={() => {
                        dispatch(authSlice.actions.logout());
                        navigate(-1);
                      }}
                    >
                      Quay lại
                    </SC.btnGray>
                  </Col>
                  <Col>
                    <SC.btnBlue>Tiếp tục</SC.btnBlue>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Content>
      </div>
    </Layout>
  );
}
