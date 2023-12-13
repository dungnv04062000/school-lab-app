import React, { useEffect, useState } from "react";
import "../loginForm.scss";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Checkbox, Col, Form, Image, Input, message, Row, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import * as SC from "../../../../../components/common/CustomButton/styled";
import Loading from "../../../../../components/common/loading/fullscreenLoading/index";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../../../redux/slices/authSlice";
import {
  isRegisterByGoogleSelector,
  loginErrorMessageSelector,
  loginLoadingSelector,
  userInfoSelector
} from "../../../../../redux/selector";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
import logo from "../../../../../assets/images/logoHeader2.png";

const googleClientId = "670750740225-hk97aiegel52utfitmm9r3ivqafadrpi.apps.googleusercontent.com";

export default function SignInForm() {
  const loading = useSelector(loginLoadingSelector);
  const loginMessage = useSelector(loginErrorMessageSelector);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const { Title } = Typography;

  const userInfo = useSelector(userInfoSelector);
  const navigate = useNavigate();

  const isRegisterByGoogle = useSelector(isRegisterByGoogleSelector);

  useEffect(() => {
    if (isRegisterByGoogle) {
      navigate("/signup-role-campus");
    }
  }, [isRegisterByGoogle]);

  useEffect(() => {
    let usernameSaved = localStorage.getItem("username") || undefined;
    let passwordSaved = localStorage.getItem("password") || undefined;
    if (usernameSaved && passwordSaved) {
      setUsername(usernameSaved);
      setPassword(passwordSaved);
    }
  }, []);

  useEffect(() => {
    if (loginMessage) {
      message.warning(loginMessage);
    }
  }, [loginMessage]);

  useEffect(() => {
    //nếu đã có tt user thì đẩy về trang ...
    if (userInfo) {
      const roles = userInfo?.roles;
      if (roles.includes("STUDENT")) {
        navigate("/student/subjects");
      } else if (roles.includes("ROOT_ADMIN")) {
        navigate("/supports");
      } else if (roles.includes("SCHOOL_ADMIN")) {
        navigate("/school-admin");
      } else if (roles.includes("TEACHER")) {
        navigate("/teacher/classes");
      } else {
        navigate("/form-teacher/students");
      }
    }
  }, [userInfo]);

  //google login
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: googleClientId,
        scope: "email"
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const responseGoogle = (response) => {
    dispatch(
      login({
        idToken: response.tokenId,
        email: response.profileObj.email
      })
    );
  };

  const onUsernameChange = (e) => {
    setUsername(e.target.value.trim());
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value.trim());
  };

  const onRemeberChange = (e) => {
    setRemember(!remember);
  };

  const dispatch = useDispatch();

  const rememberAccount = () => {
    if (remember) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
  };

  const onFinish = (values) => {
    rememberAccount();
    dispatch(
      login({
        username: username,
        password: password
      })
    );
  };
  const onFinishFailed = (errorInfo) => {
    rememberAccount();
  };

  document.title = "Đăng nhập SchoolLab";
  return (
    <div className="signin">
      <div className="signin__form">
        <Link to="/">
          <Image alt="logo" src={logo} preview={false} width={150} style={{ marginBottom: 30 }} />
        </Link>
        <Row className="signin__form-container">
          <Title className="signin__form-title" level={2}>
            Đăng Nhập
          </Title>
        </Row>
        <Row className="signin__form-data" style={{ width: "100%" }}>
          <Form
            name="normal_login"
            style={{ width: "100%" }}
            className="form-data"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row>
              <Col span={24}>
                <label>Tên đăng nhập</label>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Tên đăng nhập"
                    }
                  ]}
                >
                  <Input
                    type="text"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    size="large"
                    onChange={onUsernameChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <label>Mật khẩu</label>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Mật khẩu"
                    }
                  ]}
                >
                  <Input.Password
                    type="password"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    size="large"
                    onChange={onPasswordChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="signin__form-catag">
              <Form.Item noStyle valuePropName="checked">
                <Checkbox onClick={onRemeberChange}>Nhớ tài khoản</Checkbox>
              </Form.Item>
              <Row className="login-form-forgot">
                <Link to="/forgot-password">Quên mật khẩu</Link>
              </Row>
            </Form.Item>
            <Form.Item className="button-form">
              <SC.btnGreen className="login-form-button">Đăng nhập</SC.btnGreen>
              <GoogleLogin
                clientId={googleClientId}
                render={(renderProps) => (
                  <SC.btnWhite onClick={renderProps.onClick} className="login-form-button mt-20 google">
                    <i className="fab fa-google fa-x"></i>
                    <span>Đăng nhập với Google</span>
                  </SC.btnWhite>
                )}
                buttonText="Đăng nhập với Google"
                onSuccess={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </Form.Item>
          </Form>
        </Row>
        <Row className="signin__form-signup">
          Bạn chưa có tài khoản?
          <Link to="/signup-role-campus" className="signup-link">
            <u> Đăng Kí</u>
          </Link>
        </Row>
      </div>
      {loading && <Loading />}
    </div>
  );
}
