import { Button, Col, Divider, Form, Input, message, Modal, Row, Space, Table, Typography } from "antd";
import React, { useState } from "react";
import { EditOutlined, PlusOutlined, CameraOutlined } from "@ant-design/icons";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import "./style.scss";
import { useRef } from "react";
import BaseAPI from "../../../../util/BaseAPI";
import * as TimeUtil from "../../../../util/TimeUtil";
import { useForm } from "antd/lib/form/Form";
import { useId } from "react";
import * as ScreenShot from "../../../../util/ScreenShot";
import EditExperiment from "../EditExperiment";

const CustomizedLabel = (props) => {
  const { x, y, stroke, value } = props;

  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
      {value}
    </text>
  );
};

const CustomizedAxisTick = (props) => {
  const { x, y, stroke, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(0)">
        {payload.value}
      </text>
    </g>
  );
};

const { Title } = Typography;

function Experiment({ note, experiment, refresh, isOwner }) {
  let maxFirst = Math.max.apply(
    Math,
    experiment?.details?.map((item) => item.first_input)
  );
  let maxSecond = Math.max.apply(
    Math,
    experiment?.details?.map((item) => item.second_input)
  );
  let maxResult = Math.max.apply(
    Math,
    experiment?.details?.map((item) => item.result)
  );

  let maxOrderNumber =
    experiment?.details?.length > 0
      ? Math.max.apply(
          Math,
          experiment?.details?.map((item) => item.order_number)
        )
      : 0;

  let maxValue = Math.max(maxFirst, maxSecond, maxResult);

  let totalResult = experiment?.details?.reduce((acc, item) => acc + item.result, 0);
  let avgResult = parseFloat(totalResult / experiment?.details?.length);

  let YAxisName = "result";

  switch (maxValue) {
    case maxFirst:
      YAxisName = "first_input";
      break;
    case maxSecond:
      YAxisName = "second_input";
      break;
    case maxResult:
      YAxisName = "result";
      break;
  }

  //modal create ex-detail
  const [openModal, setOpenModal] = useState(false);
  const [createExperimentLoading, setCreateExperimentLoading] = useState(false);
  const showModal = () => {
    setOpenModal(true);
  };

  const [createForm] = useForm();
  const handleOk = () => {
    setCreateExperimentLoading(true);
    let response = BaseAPI.post(`/experiments/details`, {
      experiment_id: experiment?.id,
      first_input: firstRef.current.input.value.trim(),
      second_input: secondRef.current.input.value.trim(),
      result: resultRef.current.input.value.trim(),
      order_number: parseInt(maxOrderNumber) + 1
    });

    response
      .then((res) => {
        if (res?.status === 201) {
          message.success("Thêm thành công");
          createForm.resetFields();
          if (refresh) {
            refresh();
          }
          handleCancel();
        } else {
          message.error(res?.response?.data?.message || "Thêm thất bại");
        }
        setCreateExperimentLoading(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setCreateExperimentLoading(false);
      });
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

  const [exporting, setExporting] = useState(false);

  const exportRef = useRef();
  const exportImage = () => {
    setExporting(true);
    setTimeout(async () => {
      await ScreenShot.exportAsImage(exportRef.current, `${note?.id}_${experiment?.title}_ScreenShot.png`);
      setExporting(false);
    }, 1000);
  };

  const firstRef = useRef();
  const secondRef = useRef();
  const resultRef = useRef();

  const key = useId();

  //edit experiment
  const [openEditExperiment, setOpenEditExperiment] = useState(false);

  const showEditExperimentDrawer = () => {
    setOpenEditExperiment(true);
  };
  const closeDrawer = () => {
    setOpenEditExperiment(false);
  };

  //edit ex-detail
  const [editDetailForm] = useForm();
  const [selectedExDetail, setSelectedExDetail] = useState(null);
  const [openModalEditDetail, setOpenModalEditDetail] = useState(false);
  const showEditModal = (detail) => {
    setSelectedExDetail(detail);
    editDetailForm.setFieldsValue({
      first_input: detail?.first_input,
      second_input: detail?.second_input,
      result: detail?.result
    });
    setOpenModalEditDetail(true);
  };

  const handleEdit = () => {
    setCreateExperimentLoading(true);
    let response = BaseAPI.patch(`/experiments/details/${selectedExDetail?.id}`, {
      first_input: firstRef.current.input.value.trim(),
      second_input: secondRef.current.input.value.trim(),
      result: resultRef.current.input.value.trim()
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Cập nhật thành công");
          if (refresh) {
            refresh();
          }
          handleEditCancel();
        } else {
          message.error(res?.response?.data?.message || "Cập nhật thất bại");
        }
        setCreateExperimentLoading(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setCreateExperimentLoading(false);
      });
  };
  const handleEditCancel = () => {
    setOpenModalEditDetail(false);
  };

  const columns = [
    {
      title: "Lần",
      dataIndex: "order_number",
      width: 55,
      key: "orderNo",
      render: (value) => <b>{value}</b>
    },
    {
      title: experiment?.first_label || "Đại lượng 1",
      dataIndex: "first_input",
      key: "first_input"
    },
    {
      title: experiment?.second_label || "Đại lượng 2",
      dataIndex: "second_input",
      key: "second_input"
    },
    {
      title: experiment?.result_label || "Kết quả",
      dataIndex: "result",
      key: "result",
      render: (value) => <b>{value}</b>
    },
    {
      title: "Thời gian",
      dataIndex: "create_at",
      key: "creata_at",
      width: 160,
      render: (value) => {
        return TimeUtil.convertUTCtoDatetime(value);
      }
    },
    {
      title: "Sửa",
      dataIndex: "action",
      width: 60,
      key: "action",
      render: (_, item) => (
        <Button type="text" onClick={() => showEditModal(item)}>
          <EditOutlined />
        </Button>
      )
    }
  ];

  const teacherColumns = [
    {
      title: "Lần",
      dataIndex: "order_number",
      width: 55,
      key: "orderNo",
      render: (value) => <b>{value}</b>
    },
    {
      title: experiment?.first_label || "Đại lượng 1",
      dataIndex: "first_input",
      key: "first_input"
    },
    {
      title: experiment?.second_label || "Đại lượng 2",
      dataIndex: "second_input",
      key: "second_input"
    },
    {
      title: experiment?.result_label || "Kết quả",
      dataIndex: "result",
      key: "result",
      render: (value) => <b>{value}</b>
    },
    {
      title: "Thời gian",
      dataIndex: "create_at",
      key: "creata_at",
      width: 160,
      render: (value) => {
        return TimeUtil.convertUTCtoDatetime(value);
      }
    }
  ];

  return (
    <div key={key} ref={exportRef}>
      <Divider orientation="left">{experiment?.title}</Divider>
      <Row gutter={[10, 10]} justify="space-between" align="top">
        <Col xl={10} lg={10} md={24} sm={24} xs={24}>
          <Table
            rowKey={"id"}
            // size="small"
            className="form-experiment"
            style={{ marginBottom: 10 }}
            dataSource={experiment?.details}
            columns={isOwner ? columns : teacherColumns}
            bordered="true"
            pagination={false}
          />
          {isOwner &&
            (exporting ? (
              <></>
            ) : (
              <Row gutter={[10, 10]}>
                <Col>
                  <Button type="primary" onClick={showModal} title="Thêm thử nghiệm">
                    <PlusOutlined />
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" title="Cập nhật thí nghiệm" onClick={showEditExperimentDrawer}>
                    <EditOutlined />
                  </Button>
                  <EditExperiment
                    experiment={experiment}
                    open={openEditExperiment}
                    onClose={closeDrawer}
                    refresh={refresh}
                  />
                </Col>
                <Col>
                  <Button type="primary" onClick={exportImage} title="Chụp ảnh màn hình thí nghiệm">
                    <CameraOutlined />
                  </Button>
                </Col>
              </Row>
            ))}
          <Modal
            title={experiment?.title}
            open={openModal}
            onOk={handleOk}
            confirmLoading={createExperimentLoading}
            onCancel={handleCancel}
          >
            <Row justify="start" align="top">
              <h3>Thử nghiệm lần {parseInt(maxOrderNumber) + 1}</h3>
              <Form form={createForm}>
                <Row justify="start" gutter={[5, 10]}>
                  <Col span={8}>
                    <label>
                      {experiment?.first_label} ({experiment?.first_measure && experiment?.first_measure})
                    </label>
                    <Form.Item name={"first_input"}>
                      <Input type="number" ref={firstRef} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <label>
                      {experiment?.second_label} ({experiment?.second_measure && experiment?.second_measure})
                    </label>
                    <Form.Item name={"second_input"}>
                      <Input type="number" ref={secondRef} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <label>
                      {experiment?.result_label} ({experiment?.result_measure && experiment?.result_measure})
                    </label>
                    <Form.Item name={"result"}>
                      <Input type="number" ref={resultRef} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Row>
          </Modal>
          <Modal
            title="Chỉnh sửa thử nghiệm"
            open={openModalEditDetail}
            onOk={handleEdit}
            confirmLoading={createExperimentLoading}
            onCancel={handleEditCancel}
          >
            <Row justify="start" align="top">
              <h3>Thử nghiệm lần {selectedExDetail?.order_number}</h3>
              <Form form={editDetailForm}>
                <Row justify="start" gutter={[5, 10]}>
                  <Col span={8}>
                    <label>
                      {experiment?.first_label} ({experiment?.first_measure && experiment?.first_measure})
                    </label>
                    <Form.Item name={"first_input"}>
                      <Input type="number" ref={firstRef} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <label>
                      {experiment?.second_label} ({experiment?.second_measure && experiment?.second_measure})
                    </label>
                    <Form.Item name={"second_input"}>
                      <Input type="number" ref={secondRef} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <label>
                      {experiment?.result_label} ({experiment?.result_measure && experiment?.result_measure})
                    </label>
                    <Form.Item name={"result"}>
                      <Input type="number" ref={resultRef} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Row>
          </Modal>
        </Col>
        <Col xl={14} lg={14} md={24} sm={24} xs={24}>
          <div style={{ width: "100%", height: 500, borderLeft: "1px solid #adadad" }}>
            <ResponsiveContainer width="90%" height="100%">
              <LineChart
                data={experiment?.details}
                margin={{
                  left: 20,
                  right: 30,
                  bottom: 20
                }}
              >
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis
                  label={{ value: "Lần thử nghiệm", angle: 0, position: "bottom" }}
                  dataKey="order_number"
                  tick={<CustomizedAxisTick />}
                  padding={{ left: 15, bottom: 20 }}
                />
                <YAxis
                  dataKey={`${YAxisName}`}
                  label={{
                    value: `${experiment?.result_label} (${experiment?.result_measure || ""})`,
                    angle: -90,
                    position: "insideLeft"
                  }}
                />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                {/* <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" /> */}
                <ReferenceLine y={avgResult} stroke="green">
                  <Label position={"left"}>{Math.round(avgResult, 2)}</Label>
                  <Label position={"right"}>AVG</Label>
                </ReferenceLine>
                <Line
                  name={`${experiment?.first_label} (${experiment?.first_measure || ""})`}
                  type="monotone"
                  dataKey="first_input"
                  stroke="blue"
                  label={<CustomizedLabel />}
                />
                <Line
                  name={`${experiment?.second_label} (${experiment?.second_measure || ""})`}
                  type="monotone"
                  dataKey="second_input"
                  stroke="orange"
                  label={<CustomizedLabel />}
                />
                <Line
                  name={`${experiment?.result_label} (${experiment?.result_measure || ""})`}
                  type="monotone"
                  dataKey="result"
                  stroke="red"
                  label={<CustomizedLabel />}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Experiment;
