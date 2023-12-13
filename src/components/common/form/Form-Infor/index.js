import React, { useEffect, useState } from "react";
import { Col, Form, Row, Input, Radio, DatePicker, Button, Select, message } from "antd";
import "./formInfor.scss";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../../../../views/Account/ChangePassword";
import BaseAPI from "../../../../util/BaseAPI";
import { useDispatch } from "react-redux";
import { setCurrentUserInfo } from "../../../../redux/slices/authSlice";
import axios from "axios";

const { Option } = Select;

export default function FormInfor({ user }) {
  // ----- useState -----
  const rollNumber = user.id;
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [gender, setGender] = useState(user.gender);

  const [province, setProvince] = useState(user.city);
  const [provinceCode, setProvinceCode] = useState(user.city_code);
  const [district, setDistrict] = useState(user.district);
  const [districtCode, setDistrictCode] = useState(user.district_code);
  const [ward, setWard] = useState(user.ward);
  const [wardCode, setWardCode] = useState(user.ward_code);
  const [street, setStreet] = useState(user.street);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [dob, setDOB] = useState(user.birth_date || undefined);
  const email = user.email;
  const [phone, setPhone] = useState(user.phone_number || undefined);
  const [role, setRole] = useState([]);

  // const address = user.street + ", " + user.ward + ", " + user.district + ", " + user.city;

  useEffect(() => {
    let roleVIs = [];
    user.roles.forEach((role) => {
      let roleVI = null;
      switch (role) {
        case "ROOT_ADMIN":
          roleVI = "Quản trị hệ thống";
          break;
        case "SCHOOL_ADMIN":
          roleVI = "Quản trị trường học";
          break;
        case "TEACHER":
          roleVI = "Giáo viên";
          break;
        case "STUDENT":
          roleVI = "Học sinh";
          break;
        default:
          break;
      }
      roleVIs.push(roleVI);
      const provinceResponse = axios.get("https://provinces.open-api.vn/api/p/");
      provinceResponse
        .then((res) => {
          if (res?.status === 200) {
            setProvinces([...res.data]);
          }
        })
        .catch((err) => {});
    });

    setRole(roleVIs);
  }, []);

  useEffect(() => {
    if (provinceCode) {
      getDistricts(provinceCode);
    }
  }, [provinceCode]);

  useEffect(() => {
    if (districtCode) {
      getWards(districtCode);
    }
  }, [districtCode]);

  const [open, setOpen] = useState(false);

  const dateFormat = "DD-MM-yyyy";

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value.trim());
  };

  const handleDOBChange = (value) => {
    let dobDate = null;
    if (value) {
      dobDate = new Date(value);
    }
    setDOB(dobDate);
  };

  const handleGenderChange = ({ target: { value } }) => {
    setGender(value);
  };
  const onShowChangePasswordModal = () => {
    setOpen(true);
  };

  const dispatch = useDispatch();

  const getDistricts = (provinceCode) => {
    const districtResponse = axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    districtResponse
      .then((res) => {
        if (res?.status === 200) {
          setDistricts([...res.data.districts]);
        }
      })
      .catch((err) => {});
  };

  const handleChangeProvince = (value) => {
    setProvince(value.label);
    setProvinceCode(value.value);
  };

  const getWards = (districtCode) => {
    const wardResponse = axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    wardResponse
      .then((res) => {
        if (res?.status === 200) {
          setWards([...res.data.wards]);
        }
      })
      .catch((err) => {});
  };

  const handleChangeDistrict = (value) => {
    setDistrict(value.label);
    setDistrictCode(value.value);
  };

  const handleChangeWard = (value) => {
    setWard(value.label);
    setWardCode(value.value);
  };

  const handleStreetChange = (e) => {
    setStreet(e.target.value);
  };

  const handleOnFinish = (values) => {
    if (firstName && lastName) {
      let response = BaseAPI.patch(`users`, {
        first_name: firstName?.trim(),
        last_name: lastName?.trim(),
        gender: gender,
        phone_number: phone,
        birth_date: dob,
        city: province,
        city_code: provinceCode,
        district: district,
        district_code: districtCode,
        ward: ward,
        ward_code: wardCode,
        street: street?.trim()
      });

      response
        .then((res) => {
          if (res?.status === 200) {
            message.success("Cập nhật hồ sơ cá nhân thành công");
            dispatch(setCurrentUserInfo());
          } else {
            message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          }
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        });
    } else {
      message.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  return (
    <div className="infor-form">
      <div style={{ textAlign: "center" }}>
        <h2>Thông tin cá nhân</h2>
      </div>
      <Form onFinish={handleOnFinish}>
        <Row gutter={[10, 10]}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <label>Mã số</label>
            <Form.Item>
              <Input type="text" size="large" disabled value={rollNumber} />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <label>Vai trò</label>
            <Form.Item>
              <Input type="text" size="large" disabled value={role} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <label>Họ</label>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Vui lòng kiểm tra lại Họ"
                }
              ]}
            >
              <Input type="text" size="large" onChange={handleFirstNameChange} value={firstName} />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <label>Tên</label>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Vui lòng kiểm tra lại Tên"
                }
              ]}
            >
              <Input type="text" size="large" onChange={handleLastNameChange} value={lastName} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <label>Giới tính</label>
            <Form.Item name="gender">
              <div className="radio-option">
                <Radio.Group onChange={handleGenderChange} value={gender}>
                  <Radio value="MALE">Nam</Radio>
                  <Radio value="FEMALE">Nữ</Radio>
                </Radio.Group>
              </div>
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <label>Ngày sinh</label>
            <Form.Item>
              <DatePicker
                size="large"
                format={dateFormat}
                value={dob ? moment(dob) : null}
                onChange={handleDOBChange}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <label>Email</label>
            <Form.Item>
              <Input type="email" disabled size="large" value={email} />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <label>Số điện thoại</label>
            <Form.Item
              name="phone"
              initialValue={phone}
              rules={[
                {
                  required: false,
                  pattern: new RegExp(/^(84|0[1-9])+(([0-9]{8}|([0-9]){7}))$/),
                  message: "Số điện thoại không hợp lệ"
                }
              ]}
            >
              <Input type="text" size="large" onChange={handlePhoneChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <label>Tỉnh/Thành Phố</label>
            <Form.Item
              name="city"
              initialValue={Number(provinceCode)}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tỉnh, thành phố"
                }
              ]}
            >
              <Select
                labelInValue={true}
                size="large"
                showSearch
                optionFilterProp="children"
                onChange={handleChangeProvince}
                placeholder="Đang lấy dữ liệu..."
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
          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <label>Quận/Huyện</label>
            <Form.Item
              name="district"
              initialValue={Number(districtCode)}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn quận, huyện"
                }
              ]}
            >
              <Select
                labelInValue={true}
                size="large"
                showSearch
                optionFilterProp="children"
                onChange={handleChangeDistrict}
                placeholder="Chọn Tỉnh/Tp trước"
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
          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <label>Xã/Phường</label>
            <Form.Item
              name="ward"
              initialValue={Number(wardCode)}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn xã, phường"
                }
              ]}
            >
              <Select
                labelInValue={true}
                size="large"
                showSearch
                optionFilterProp="children"
                onChange={handleChangeWard}
                placeholder="Chọn Quận/Huyện trước"
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
          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <label>Địa chỉ</label>
            <Form.Item
              name="street"
              initialValue={street}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập Địa chỉ"
                }
              ]}
            >
              <Input type="text" size="large" onChange={handleStreetChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <label>Ngày đăng ký</label>
            <Form.Item>
              <DatePicker size="large" format="DD-MM-yyyy HH:mm" disabled value={moment.unix(user.register_at)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col>
            <Form.Item>
              <Button htmlType="submit" className="btn-save-infor" size="large">
                Cập nhật
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button className="btn-change-password" size="large" onClick={onShowChangePasswordModal}>
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <ChangePasswordModal openModal={open} handleCancel={() => setOpen(false)} />
    </div>
  );
}
