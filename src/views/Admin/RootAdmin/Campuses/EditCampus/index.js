import { Form, Input, message, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as SC from "../../../../../components/common/CustomButton/styled";
import Loading from "../../../../../components/common/loading";
import BaseAPI from "../../../../../util/BaseAPI";

const { Option } = Select;

function EditCampus({ campus, onClose, refresh }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(campus?.name);

  const [users, setUsers] = useState([]);
  const [adminId, setAdminId] = useState(campus?.admin_id);

  //address
  const [province, setProvince] = useState(campus?.city);
  const [provinceCode, setProvinceCode] = useState(campus?.city_code);
  const [district, setDistrict] = useState(campus?.district);
  const [districtCode, setDistrictCode] = useState(campus?.district_code);
  const [ward, setWard] = useState(campus?.ward);
  const [wardCode, setWardCode] = useState(campus?.ward_code);
  const [street, setStreet] = useState(campus?.street);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [form] = useForm();

  useEffect(() => {
    setName(campus?.name);
    setAdminId(campus?.admin_id || null);
    setProvince(campus?.city);
    setProvinceCode(campus?.city_code);
    setDistrict(campus?.district);
    setDistrictCode(campus?.district_code);
    setWard(campus?.ward);
    setWardCode(campus?.ward_code);
    setStreet(campus?.street);
  }, [campus]);

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
    setProvinceCode(value.key);
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

  useEffect(() => {
    let response = BaseAPI.get(`/users/${campus?.id}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setUsers(res.data.items);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        setUsers([]);
      });
  }, [campus]);

  const handleChangeDistrict = (value) => {
    setDistrict(value.label);
    setDistrictCode(value.key);
  };

  const handleChangeWard = (value) => {
    setWard(value.label);
    setWardCode(value.key);
  };

  const handleStreetChange = (e) => {
    setStreet(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleAdminChange = (value) => {
    setAdminId(value);
  };

  const updateCampus = () => {
    if (name?.trim()?.length === 0) {
      message.error("Tên campus không được để trống");
    } else if (street?.trim()?.length === 0) {
      message.error("Địa chỉ không được để trống");
    } else {
      setLoading(true);
      let response = BaseAPI.patch(`/campuses/${campus?.id}`, {
        name: name?.trim(),
        admin_id: adminId,
        city: province,
        city_code: provinceCode,
        district: district,
        district_code: districtCode,
        ward: ward,
        ward_code: wardCode,
        street: street
      });

      response
        .then((res) => {
          if (res?.status === 200) {
            message.success("Cập nhật thành công");
            if (refresh) {
              refresh();
            }
            onClose();
          } else {
            message.error(res?.response?.data?.message || "Cập nhật thất bại");
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        });
    }
  };

  return (
    <>
      <Form form={form} onFinish={updateCampus}>
        <label>Tên Campus</label>
        <Form.Item>
          <Input type="text" size="large" onChange={handleNameChange} value={name} />
        </Form.Item>
        <label>Quản trị viên</label>
        <Form.Item>
          <Select size="large" showSearch value={adminId} optionFilterProp="children" onChange={handleAdminChange}>
            {users.map((user) => {
              return (
                <Option key={user.id} value={user.id} disabled={user.id === adminId}>
                  {user.id} - {user.first_name} {user.last_name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <label>Tỉnh/Thành Phố</label>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng chọn tỉnh, thành phố"
            }
          ]}
        >
          <Select
            size="large"
            labelInValue
            showSearch
            value={Number(provinceCode)}
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
        <label>Quận/Huyện</label>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng chọn quận, huyện"
            }
          ]}
        >
          <Select
            size="large"
            labelInValue
            showSearch
            value={Number(districtCode)}
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
        <label>Xã/Phường</label>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng chọn xã, phường"
            }
          ]}
        >
          <Select
            size="large"
            labelInValue
            showSearch
            value={Number(wardCode)}
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
        <label>Địa chỉ</label>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng nhập lại Địa chỉ"
            }
          ]}
        >
          <Input type="text" size="large" onChange={handleStreetChange} value={street} />
        </Form.Item>
        <Form.Item>{loading ? <Loading /> : <SC.btnBlue>Cập nhật</SC.btnBlue>}</Form.Item>
      </Form>
    </>
  );
}

export default EditCampus;
