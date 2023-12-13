import { Col, Form, Input, message, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import AppDrawer from "../../../../components/common/drawer";
import * as SC from "../../../../components/common/CustomButton/styled";
import BaseAPI from "../../../../util/BaseAPI";
import Loading from "../../../../components/common/loading/index";
import { useId } from "react";

function EditExperiment({ experiment, open, onClose, refresh }) {
  const [loading, setLoading] = useState(false);

  const titleRef = useRef();
  const firstLabelRef = useRef();
  const firstMeasureRef = useRef();
  const secondLabelRef = useRef();
  const secondMeasureRef = useRef();
  const resultLabelRef = useRef();
  const resultMeasureRef = useRef();

  const [form] = useForm();

  const handleEditExperiment = () => {
    setLoading(true);
    let response = BaseAPI.patch(`/experiments/${experiment?.id}`, {
      title: titleRef.current.input.value.trim(),
      first_label: firstLabelRef.current.input.value.trim(),
      first_measure: firstMeasureRef.current.input.value.trim(),
      second_label: secondLabelRef.current.input.value.trim(),
      second_measure: secondMeasureRef.current.input.value.trim(),
      result_label: resultLabelRef.current.input.value.trim(),
      result_measure: resultMeasureRef.current.input.value.trim()
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Cập nhật thí nghiệm thành công");
          // form.resetFields();
          if (refresh) {
            refresh();
          }
          onClose();
        } else {
          message.success(res?.response?.data?.message || "Cập nhật thí nghiệm thất bại");
        }
        setLoading(false);
      })
      .catch((err) => {
        message.success(err?.response?.data?.message || "Có lỗi xảy ra");
        setLoading(false);
      });
  };

  const key = useId();
  return (
    <AppDrawer
      key={key}
      open={open}
      onClose={onClose}
      title="Cập nhật thí nghiệm"
      content={
        <Form
          form={form}
          onFinish={handleEditExperiment}
          initialValues={{
            title: experiment?.title,
            firstLabel: experiment?.first_label,
            firstMeasure: experiment?.first_measure,
            secondLabel: experiment?.second_label,
            secondMeasure: experiment?.second_measure,
            resultLabel: experiment?.result_label,
            resultMeasure: experiment?.result_measure
          }}
        >
          <label>Tên thí nghiệm</label>
          <Form.Item
            name={"title"}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên thí nghiệm"
              }
            ]}
          >
            <Input type="text" ref={titleRef} />
          </Form.Item>
          <Row gutter={[10, 10]}>
            <Col span={12}>
              <label>Đại lượng 1</label>
              <Form.Item name={"firstLabel"}>
                <Input type="text" placeholder="Tên gọi" ref={firstLabelRef} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <label>Đơn vị đo</label>
              <Form.Item
                name={"firstMeasure"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đơn vị đo"
                  }
                ]}
              >
                <Input type="text" ref={firstMeasureRef} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col span={12}>
              <label>Đại lượng 2</label>
              <Form.Item name={"secondLabel"}>
                <Input type="text" placeholder="Tên gọi" ref={secondLabelRef} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <label>Đơn vị đo</label>
              <Form.Item
                name={"secondMeasure"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đơn vị đo"
                  }
                ]}
              >
                <Input type="text" ref={secondMeasureRef} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col span={12}>
              <label>Kết quả</label>
              <Form.Item name={"resultLabel"}>
                <Input type="text" placeholder="Tên gọi" ref={resultLabelRef} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <label>Đơn vị đo</label>
              <Form.Item
                name={"resultMeasure"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đơn vị đo"
                  }
                ]}
              >
                <Input type="text" ref={resultMeasureRef} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>{loading ? <Loading /> : <SC.btnBlue>Lưu</SC.btnBlue>}</Form.Item>
        </Form>
      }
    />
  );
}

export default EditExperiment;
