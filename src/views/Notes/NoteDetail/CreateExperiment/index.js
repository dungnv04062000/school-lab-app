import { Col, Form, Input, message, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import AppDrawer from "../../../../components/common/drawer";
import * as SC from "../../../../components/common/CustomButton/styled";
import BaseAPI from "../../../../util/BaseAPI";
import Loading from "../../../../components/common/loading/index";

function CreateExperiment({ note, open, onClose, refresh }) {
  const [loading, setLoading] = useState(false);

  const titleRef = useRef();
  const firstLabelRef = useRef();
  const firstMeasureRef = useRef();
  const secondLabelRef = useRef();
  const secondMeasureRef = useRef();
  const resultLabelRef = useRef();
  const resultMeasureRef = useRef();

  const [form] = useForm();

  const handleCreateExperiment = () => {
    setLoading(true);
    let response = BaseAPI.post(`/experiments`, {
      note_id: note?.id,
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
        if (res?.status === 201) {
          message.success("Tạo thí nghiệm thành công");
          form.resetFields();
          if (refresh) {
            refresh();
          }
          onClose();
        } else {
          message.success(res?.response?.data?.message || "Tạo thí nghiệm thất bại");
        }
        setLoading(false);
      })
      .catch((err) => {
        message.success(err?.response?.data?.message || "Có lỗi xảy ra");
        setLoading(false);
      });
  };
  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title="Tạo thí nghiệm mới"
      content={
        <Form form={form} onFinish={handleCreateExperiment}>
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
              <Form.Item name={"label1"}>
                <Input type="text" ref={firstLabelRef} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <label>Đơn vị đo</label>
              <Form.Item
                name={"measure1"}
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
              <Form.Item name={"label2"}>
                <Input type="text" ref={secondLabelRef} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <label>Đơn vị đo</label>
              <Form.Item
                name={"measure2"}
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
              <Form.Item name={"label3"}>
                <Input type="text" ref={resultLabelRef} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <label>Đơn vị đo</label>
              <Form.Item
                name={"measureResult"}
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
          <Form.Item>{loading ? <Loading /> : <SC.btnBlue>Tạo</SC.btnBlue>}</Form.Item>
        </Form>
      }
    />
  );
}

export default CreateExperiment;
