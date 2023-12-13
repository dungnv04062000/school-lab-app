import { Checkbox, Col, Collapse, Drawer, Form, InputNumber, List, message, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import BaseAPI from "../../../util/BaseAPI";
import SkeletonApp from "../../common/Skeleton";
import * as SC from "../../common/CustomButton/styled";
import Dragger from "antd/lib/upload/Dragger";
import { CloudUploadOutlined, ReloadOutlined } from "@ant-design/icons";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../common/loading";
import groupSlice, { random, order, createTemplate, template } from "../../../redux/slices/groupSlice";

const { Panel } = Collapse;
const { Title } = Typography;

export default function TeacherClassGroup({ classId, lessonId, lessonStatus }) {
  const dispatch = useDispatch();

  const [classGroups, setClassGroups] = useState(null);
  const [override, setOverride] = useState(false);

  const loading = useSelector((state) => state.group.loading);
  const responseMessage = useSelector((state) => state.group.message);
  const messageType = useSelector((state) => state.group.messageType);

  const [openRandomGroup, setOpenRandomGroup] = useState(false);
  const [openOrderGroup, setOpenOrderGroup] = useState(false);
  const [openTemplateGroup, setOpenTemplateGroup] = useState(false);

  //template
  const templateLoading = useSelector((state) => state.group.createTemplate.loading);
  const templateLink = useSelector((state) => state.group.createTemplate.templateLink);
  const templateMeassge = useSelector((state) => state.group.createTemplate.message);
  const templateStatus = useSelector((state) => state.group.createTemplate.templateStatus);

  const [numberOfGroup, setNumberOfGroup] = useState(2);

  const [file, setFile] = useState({});

  useEffect(() => {
    if (responseMessage && messageType) {
      if (messageType === "SUCCESS") {
        message.success(responseMessage);
        getClassGroup();
      } else {
        message.error(responseMessage);
      }
      dispatch(groupSlice.actions.resetState());
    }
  }, [responseMessage, messageType]);

  useEffect(() => {
    getClassGroup();
  }, []);

  const getClassGroup = () => {
    let response = BaseAPI.get(`/class-groups/${classId}/${lessonId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setClassGroups(res.data.items);
        }
      })
      .catch((err) => {
        setClassGroups(null);
      });
  };

  const handleOverrideChange = (checked) => {
    setOverride(checked.target.checked);
  };

  const onOpenRandowGroup = () => {
    setOpenRandomGroup(true);
  };
  const onOpenOrderGroup = () => {
    setOpenOrderGroup(true);
  };
  const onOpenTemplateGroup = () => {
    setOpenTemplateGroup(true);
  };

  const onCloseRandowGroup = () => {
    setOpenRandomGroup(false);
  };
  const onCloseOrderGroup = () => {
    setOpenOrderGroup(false);
  };
  const onCloseTemplateGroup = () => {
    setOpenTemplateGroup(false);
  };

  const handleNumberOfGroup = (value) => {
    setNumberOfGroup(value);
  };

  const sendRequestRandomGroup = () => {
    dispatch(
      random({
        classId: classId,
        lessonId: lessonId,
        numberOfGroup: numberOfGroup,
        override: override
      })
    );
  };

  const sendRequestOpenGroup = () => {
    dispatch(
      order({
        classId: classId,
        lessonId: lessonId,
        numberOfGroup: numberOfGroup,
        override: override
      })
    );
  };

  const sendRequestCreateTemplate = () => {
    dispatch(
      createTemplate({
        classId: classId
      })
    );
  };

  const sendRequestTemplateGroup = () => {
    dispatch(
      template({
        classId: classId,
        lessonId: lessonId,
        file: file
      })
    );
  };

  const dummyRequest = ({ file, onSuccess, onFailure }) => {
    setTimeout(() => {
      setFile(file);
      onSuccess("ok");
    }, 2000);
  };

  const beforeUpload = (file) => {
    if (file.size > 25000000) {
      setFile({});
      message.error("Kích thước file này đã vượt quá 25MB, không thể tải lên");
      return false;
    } else {
      return true;
    }
  };

  const onRemove = () => {
    setFile({});
  };

  const props = {
    name: "file",
    accept: ".xlsx",
    multiple: false,
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`Tải lên thành công file ${info.file.name}`);
      } else if (status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
    beforeUpload: beforeUpload,
    onRemove: onRemove,
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068"
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`
    }
  };

  return (
    <SkeletonApp
      content={
        <>
          {lessonStatus === "ONGOING" && (
            <>
              <Title level={4}>Chia nhóm</Title>
              <Checkbox checked={override} onChange={handleOverrideChange}>
                Ghi đè nhóm đã có
              </Checkbox>
              <Row gutter={[10, 10]} align="middle" style={{ marginBottom: 30, marginTop: 20 }}>
                <Col>
                  <SC.btnWhite onClick={getClassGroup}>
                    <ReloadOutlined />
                  </SC.btnWhite>
                </Col>
                <Col>
                  <SC.btnWhite onClick={onOpenRandowGroup}>Ngẫu nhiên</SC.btnWhite>
                </Col>
                <Col>
                  <SC.btnGreenLight onClick={onOpenOrderGroup}>Theo thứ tự</SC.btnGreenLight>
                </Col>
                <Col>
                  <SC.btnLightGreen onClick={onOpenTemplateGroup}>Theo mẫu</SC.btnLightGreen>
                </Col>
                <Drawer
                  title="Chia nhóm ngẫu nhiên"
                  placement="right"
                  onClose={onCloseRandowGroup}
                  open={openRandomGroup}
                >
                  <Form>
                    <h4>Số nhóm cần tạo:</h4>
                    <Form.Item name="numberOfGroup">
                      <InputNumber
                        style={{ width: "100%" }}
                        size="large"
                        min={2}
                        defaultValue={numberOfGroup}
                        onChange={handleNumberOfGroup}
                      />
                    </Form.Item>
                  </Form>
                  {loading ? <Loading /> : <SC.btnBlue onClick={sendRequestRandomGroup}>Tạo</SC.btnBlue>}
                </Drawer>
                <Drawer
                  title="Chia nhóm theo thứ tự danh sánh"
                  placement="right"
                  onClose={onCloseOrderGroup}
                  open={openOrderGroup}
                >
                  <Form>
                    <h4>Số nhóm cần tạo:</h4>
                    <Form.Item name="numberOfGroup">
                      <InputNumber
                        style={{ width: "100%" }}
                        size="large"
                        min={2}
                        defaultValue={numberOfGroup}
                        onChange={handleNumberOfGroup}
                      />
                    </Form.Item>
                  </Form>
                  {loading ? <Loading /> : <SC.btnBlue onClick={sendRequestOpenGroup}>Tạo</SC.btnBlue>}
                </Drawer>
                <Drawer
                  title="Chia nhóm theo mẫu"
                  placement="right"
                  size="large"
                  onClose={onCloseTemplateGroup}
                  open={openTemplateGroup}
                >
                  <Title level={5} style={{ color: "red", fontStyle: "italic" }}>
                    Tạo theo mẫu sẽ tự động ghi đè nhóm đã có
                  </Title>
                  <Dragger maxCount={1} {...props} style={{ width: "100%", height: "300px" }}>
                    <p className="ant-upload-drag-icon">
                      <CloudUploadOutlined />
                    </p>
                    <p className="ant-upload-text">Chọn hoặc kéo thả file vào đây để tải lên</p>
                    <br />
                    <h4>Nếu chưa có mẫu, vui lòng tạo và tải mẫu ở link bên dưới về và điền vào mẫu</h4>
                  </Dragger>
                  {!templateLink ? (
                    templateLoading ? (
                      <Row>
                        <Loading />
                      </Row>
                    ) : (
                      <Title level={4} className="create-template" onClick={sendRequestCreateTemplate}>
                        Tạo mẫu danh sách nhóm
                      </Title>
                    )
                  ) : (
                    <Row align="top">
                      <Title level={5} style={{ marginRight: 20 }}>
                        {templateMeassge}
                      </Title>
                      {templateStatus && <a href={templateLink}>Tải xuống</a>}
                    </Row>
                  )}

                  {loading ? (
                    <Loading />
                  ) : (
                    <SC.btnWhite style={{ marginTop: 20 }} onClick={sendRequestTemplateGroup}>
                      Tạo
                    </SC.btnWhite>
                  )}
                </Drawer>
              </Row>
            </>
          )}
          {classGroups?.length > 0 ? (
            <>
              <Title level={4}>Danh sách nhóm</Title>
              <SkeletonApp
                content={
                  <Collapse>
                    {classGroups.map((group) => {
                      return (
                        <Panel key={group.id} header={group.name}>
                          <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={group.members}
                            renderItem={(item) => (
                              <List.Item>
                                <List.Item.Meta title={item.member_name} description={item.member_id} />
                              </List.Item>
                            )}
                          />
                        </Panel>
                      );
                    })}
                  </Collapse>
                }
              />
            </>
          ) : (
            <Row style={{ color: "blue" }}>Dự án này chưa được chia nhóm</Row>
          )}
        </>
      }
    />
  );
}
