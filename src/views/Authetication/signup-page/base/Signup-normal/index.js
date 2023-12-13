import { Checkbox, Col, DatePicker, Form, Input, Layout, Radio, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import * as SC from "../../../../../components/common/CustomButton/styled";
import "./style.scss";
import AppHeaderMain from "../../../../../components/common/header/guest/headerMain";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../../../redux/slices/authSlice";
import {
  emailRegisterSelector,
  registerCampusSelector,
  registerErrorMessageSelector,
  registerLoadingSelector,
  registerRoleSelector,
  registerSuccessSelector
} from "../../../../../redux/selector";
import Loading from "../../../../../components/common/loading/fullscreenLoading/index";
const { Option } = Select;
const { Header, Content } = Layout;

export default function SignupNormal() {
  document.title = "Đăng ký tài khoản";

  const registerErrorMessage = useSelector(registerErrorMessageSelector);
  const isLoading = useSelector(registerLoadingSelector);
  const registerSuccess = useSelector(registerSuccessSelector);
  const registerRole = useSelector(registerRoleSelector);
  const registerCampus = useSelector(registerCampusSelector);
  const emailRegister = useSelector(emailRegisterSelector);

  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("MALE");
  const [birthDate, setBirthDate] = useState(0);
  const [province, setProvince] = useState("");
  const [province_code, setProvinceCode] = useState(1);
  const [district, setDistrict] = useState("");
  const [district_code, setDistrictCode] = useState(1);
  const [ward, setWard] = useState("");
  const [ward_code, setWardCode] = useState(1);
  const [street, setStreet] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repass, setRepass] = useState("");

  const [passwordNotMatch, setPasswordNotMatch] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const navigate = useNavigate();

  const [isRegisterByGoogle, setIsRegisterByGoogle] = useState(false);

  useEffect(() => {
    if (emailRegister) {
      console.log(emailRegister);
      setEmail(emailRegister);
      setIsRegisterByGoogle(true);
    }
  }, []);

  useEffect(() => {
    if (!registerRole || !registerCampus) {
      navigate("/signup-role-campus");
    }
  }, [registerRole, registerCampus]);

  useEffect(() => {
    if (registerSuccess) {
      navigate("/check-email");
    }
  }, [registerSuccess]);

  useEffect(() => {
    if (registerErrorMessage) {
      message.warning(registerErrorMessage);
    }
  }, [registerErrorMessage]);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value.trim());
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value.trim());
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value.trim());
  };

  const handlePhoneNumberChange = (e) => {
    setPhone(e.target.value.trim());
  };

  const handleBirthDateChange = (value) => {
    if (value) {
      setBirthDate(value.valueOf());
    } else {
      setBirthDate(null);
    }
  };

  const handleStreetChange = (e) => {
    setStreet(e.target.value.trim());
  };

  const handleChangeGender = ({ target: { value } }) => {
    setGender(value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value.trim());
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value.trim());
  };

  const handlePasswordChange = (e) => {
    setPasswordNotMatch(false);
    setPassword(e.target.value.trim());
  };

  const handleRePasswordChange = (e) => {
    setPasswordNotMatch(false);
    setRepass(e.target.value.trim());
  };

  useEffect(() => {
    const provinceResponse = axios.get("https://provinces.open-api.vn/api/p/");
    provinceResponse
      .then((res) => {
        if (res?.status === 200) {
          setProvinces([...res.data]);
        }
      })
      .catch((err) => console.log("get provinces err", err));
  }, []);

  const dispatch = useDispatch();
  const onFinish = () => {
    if (password !== repass) {
      setPasswordNotMatch(true);
      return;
    }

    dispatch(
      register({
        username: username,
        password: password,
        user_id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        birth_date: birthDate,
        phone_number: phone,
        city: province,
        city_code: province_code,
        district: district,
        district_code: district_code,
        ward: ward,
        ward_code: ward_code,
        street: street
      })
    );
  };

  const handleChangeProvince = (value) => {
    setProvince(value.label);
    setProvinceCode(value.value);
    const districtResponse = axios.get(`https://provinces.open-api.vn/api/p/${value.value}?depth=2`);

    districtResponse
      .then((res) => {
        if (res?.status === 200) {
          setDistricts([...res.data.districts]);
        }
      })
      .catch((err) => console.log("district error", err));
  };

  const handleChangeDistrict = (value) => {
    setDistrict(value.label);
    setDistrictCode(value.value);
    const wardResponse = axios.get(`https://provinces.open-api.vn/api/d/${value.value}?depth=2`);

    wardResponse
      .then((res) => {
        if (res?.status === 200) {
          setWards([...res.data.wards]);
        }
      })
      .catch((err) => console.log("wards error", err));
  };

  const handleChangeWard = (value) => {
    setWard(value.label);
    setWardCode(value.value);
  };

  return (
    <Layout className="mainLayout">
      <Header>
        <AppHeaderMain />
      </Header>
      <Content>
        <div className="signup-data-form-normal">
          <div style={{ textAlign: "center" }}>
            <h2>Đăng kí tài khoản</h2>
          </div>
          <Form name="sign-normal" initialValues={{ remember: true }} className="form-data" onFinish={onFinish}>
            <Row gutter={[10, 10]} justify="center">
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <label>Họ</label>
                <Form.Item
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Họ"
                    }
                  ]}
                >
                  <Input type="text" size="large" onChange={handleFirstNameChange} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <label>Tên</label>
                <Form.Item
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Tên"
                    }
                  ]}
                >
                  <Input type="text" size="large" onChange={handleLastNameChange} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[10, 10]} justify="center">
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <label>Mã số:</label>
                <Form.Item
                  name="userId"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Mã số"
                    }
                  ]}
                >
                  <Input type="text" size="large" onChange={handleUserIdChange} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <label>Số điện thoại</label>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: false,
                      pattern: new RegExp(/^(84|0[1-9])+(([0-9]{8}|([0-9]){7}))$/),
                      message: "Số điện thoại không hợp lệ"
                    }
                  ]}
                >
                  <Input type="text" size="large" onChange={handlePhoneNumberChange} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[10, 10]} justify="center">
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <label>Giới tính</label>
                <Form.Item name="gender">
                  <div className="radio-option">
                    <Radio.Group onChange={handleChangeGender} value={gender}>
                      <Radio value="MALE" checked>
                        Nam
                      </Radio>
                      <Radio value="FEMALE">Nữ</Radio>
                    </Radio.Group>
                  </div>
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <label>Ngày sinh</label>
                <Form.Item name="dob">
                  <DatePicker size="large" onChange={handleBirthDateChange} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[10, 10]} justify="center">
              <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                <label>Tỉnh/Thành Phố</label>
                <Form.Item
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn tỉnh, thành phố"
                    }
                  ]}
                >
                  <Select
                    size="large"
                    labelInValue={true}
                    showSearch
                    optionFilterProp="children"
                    onChange={handleChangeProvince}
                  >
                    {provinces.map((province) => {
                      return (
                        <Option key={province.code} value={province.code}>
                          {province.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                <label>Quận/Huyện</label>
                <Form.Item
                  name="district"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn quận, huyện"
                    }
                  ]}
                >
                  <Select
                    size="large"
                    labelInValue={true}
                    showSearch
                    optionFilterProp="children"
                    onChange={handleChangeDistrict}
                  >
                    {districts.map((district) => {
                      return (
                        <Option key={district.code} value={district.code}>
                          {district.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                <label>Xã/Phường</label>
                <Form.Item
                  name="ward"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn xã, phường"
                    }
                  ]}
                >
                  <Select
                    size="large"
                    labelInValue={true}
                    showSearch
                    optionFilterProp="children"
                    onChange={handleChangeWard}
                  >
                    {wards.map((ward) => {
                      return (
                        <Option key={ward.code} value={ward.code}>
                          {ward.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                <label>Địa chỉ</label>
                <Form.Item
                  name="street"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập lại Địa chỉ"
                    }
                  ]}
                >
                  <Input type="text" size="large" onChange={handleStreetChange} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[10, 10]} justify="center">
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <label>Tên đăng nhập</label>
                <Form.Item
                  name="nameAccount"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên đăng nhập"
                    },
                    {
                      pattern: new RegExp(/^[a-zA-Z\_0-9]+$/),
                      message: "Tên đăng nhập chỉ được bao gồm chữ cái, số và ký tự _"
                    },
                    {
                      min: 6,
                      message: "Tên tài khoản phải có ít nhất 6 ký tự"
                    }
                  ]}
                >
                  <Input type="text" size="large" onChange={handleUsernameChange} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <label>Email</label>
                {isRegisterByGoogle ? (
                  <Form.Item style={{ fontStyle: "italic", fontWeight: "550" }}>{email}</Form.Item>
                ) : (
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "Email không hợp lệ"
                      },
                      {
                        required: true,
                        message: "Vui lòng nhập Email"
                      }
                    ]}
                  >
                    <Input type="text" size="large" onChange={handleEmailChange} />
                  </Form.Item>
                )}
              </Col>
            </Row>

            <Row gutter={[10, 10]} justify="center">
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <label>Mật Khẩu</label>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      min: 6,
                      message: "Mật khẩu phải có ít nhất 6 kí tự"
                    },
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu!"
                    }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    size="large"
                    onChange={handlePasswordChange}
                  />
                </Form.Item>
                {passwordNotMatch && <span style={{ color: "red" }}>Mật khẩu không hợp lệ hoặc không khớp</span>}
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <label>Nhập lại mật khẩu</label>
                <Form.Item
                  name="re-password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập lại mật khẩu!"
                    }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    size="large"
                    onChange={handleRePasswordChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className="verify-checkbox" gutter={[10, 10]} justify="center">
              <Col>
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error("Vui lòng đọc và đồng ý các điều khoản"))
                    }
                  ]}
                >
                  <Checkbox>
                    Tôi hiểu và đồng ý với <a href="##">Điều khoản dịch vụ</a> của SchoolLAB, bao gồm cả{" "}
                    <a href="##">Thỏa thuận người dùng và Chính sách quyền riêng tư.</a>
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[10, 10]} justify="center">
              <Col>
                <Form.Item>
                  <SC.btnGray className="cancle-form-button" onClick={() => navigate(-1)}>
                    Quay lại
                  </SC.btnGray>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <SC.btnBlue className="signup-form-button">Đăng ký</SC.btnBlue>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Content>
      {isLoading && <Loading />}
    </Layout>
  );
}
