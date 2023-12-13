import { Form, Input, message, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as SC from "../../../../../components/common/CustomButton/styled";
import Loading from "../../../../../components/common/loading";
import BaseAPI from "../../../../../util/BaseAPI";

const { Option } = Select;

function Createampus({ onClose, refresh }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);

  //address
  const [province, setProvince] = useState(null);
  const [province_code, setProvinceCode] = useState(1);
  const [district, setDistrict] = useState(null);
  const [district_code, setDistrictCode] = useState(1);
  const [ward, setWard] = useState(null);
  const [ward_code, setWardCode] = useState(1);
  const [street, setStreet] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [form] = useForm();

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

  const handleStreetChange = (e) => {
    setStreet(e.target.value.trim());
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const createCampus = () => {
    setLoading(true);
    let response = BaseAPI.post(`/campuses`, {
      name: name?.trim(),
      city: province,
      city_code: province_code,
      district: district,
      district_code: district_code,
      ward: ward,
      ward_code: ward_code,
      street: street
    });

    response
      .then((res) => {
        if (res?.status === 201) {
          message.success("Tạo thành công");
          if (refresh) {
            refresh();
          }
          setName(null);
          setStreet(null);
          form.resetFields();
          onClose();
        } else {
          message.error(res?.response?.data?.message || "Tạo thất bại");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  return (
    <>
      <Form form={form} onFinish={createCampus}>
        <label>Tên Campus</label>
        <Form.Item
          name={"name"}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên campus"
            }
          ]}
        >
          <Input type="text" size="large" onChange={handleNameChange} />
        </Form.Item>
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
          <Select size="large" labelInValue={true} showSearch optionFilterProp="children" onChange={handleChangeWard}>
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
          name="street"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Địa chỉ"
            }
          ]}
        >
          <Input type="text" size="large" onChange={handleStreetChange} />
        </Form.Item>
        <Form.Item>{loading ? <Loading /> : <SC.btnBlue>Tạo</SC.btnBlue>}</Form.Item>
      </Form>
    </>
  );
}

export default Createampus;
