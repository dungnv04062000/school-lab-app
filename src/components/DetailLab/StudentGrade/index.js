import { Card, Col, Divider, List, message, Rate, Row, Typography } from "antd";
import React, { memo, useEffect } from "react";
import { useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import * as SC from "../../common/CustomButton/styled";
import BaseAPI from "../../../util/BaseAPI";
import SkeletonApp from "../../common/Skeleton";
import ModalTeammateGrade from "./ModalTeammateGrade";
import Loading from "../../common/loading";

const { Title } = Typography;
function StudentGrade({ lesson }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getEvaluationGroups();
  }, []);

  const getEvaluationGroups = () => {
    let response = BaseAPI.get(`/evaluations/groups`, {
      params: {
        lesson_id: lesson.id
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setGroups(res.data.items);
        } else {
          setGroups([]);
        }
      })
      .catch((err) => {
        setGroups([]);
      });
  };

  const [openTeammateGrade, setOpenTeammateGrade] = useState(false);
  const showModalTeammateGrade = () => {
    setOpenTeammateGrade(true);
  };
  const handleCancelTeammateGrade = () => {
    setOpenTeammateGrade(false);
  };

  const handleSaveEvaluation = (group) => {
    let response = BaseAPI.post(`/evaluations/groups`, {
      group_id: group.group_id,
      lesson_id: lesson.id,
      preparation: group.preparation,
      implementation: group.implementation,
      presentation: group.presentation,
      production: group.production
    });

    response
      .then((res) => {
        if (res?.status === 201) {
          message.success(`Đánh giá ${group.group_name} thành công`);
          getEvaluationGroups();
        } else {
          message.error(res?.response?.data?.message || "Đánh giá thất bại");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const handlePreparationChange = (group, value) => {
    setGroups((prev) => {
      return groups.map((item) => {
        return {
          ...item,
          preparation: item.group_id === group.group_id ? value : item.preparation
        };
      });
    });
  };
  const handleImplementationChange = (group, value) => {
    setGroups((prev) => {
      return groups.map((item) => {
        return {
          ...item,
          implementation: item.group_id === group.group_id ? value : item.implementation
        };
      });
    });
  };
  const handlePresentationChange = (group, value) => {
    setGroups((prev) => {
      return groups.map((item) => {
        return {
          ...item,
          presentation: item.group_id === group.group_id ? value : item.presentation
        };
      });
    });
  };
  const handleProductionChange = (group, value) => {
    setGroups((prev) => {
      return groups.map((item) => {
        return {
          ...item,
          production: item.group_id === group.group_id ? value : item.production
        };
      });
    });
  };

  return (
    <>
      <Title level={3}>Đánh giá</Title>
      <Row gutter={[10, 0]} justify="start" align="middle">
        <Col>
          <SC.btnBlue onClick={showModalTeammateGrade}>
            <b>Thành viên trong nhóm</b>
          </SC.btnBlue>
        </Col>
        <ModalTeammateGrade lesson={lesson} open={openTeammateGrade} onClose={handleCancelTeammateGrade} />
      </Row>
      <Divider orientation="left">Nhóm khác</Divider>
      <Row>
        <SC.btnWhite onClick={getEvaluationGroups} style={{ margin: "20px 0" }}>
          <ReloadOutlined />
        </SC.btnWhite>
      </Row>
      <Row>
        <SkeletonApp
          content={
            <List
              style={{ width: "100%" }}
              grid={{
                gutter: 10,
                column: 1
              }}
              dataSource={groups}
              renderItem={(item) => (
                <List.Item key={item.group_id}>
                  <Card title={item.group_name}>
                    <Row justify="space-between" align="middle" style={{ fontWeight: 550 }}>
                      <Col
                        xl={3}
                        lg={3}
                        md={8}
                        sm={24}
                        xs={24}
                        style={{
                          color: item?.create_at ? "blue" : "red"
                        }}
                      >
                        {item?.create_at ? "Đã đánh giá" : "Bạn chưa đánh giá nhóm này"}
                      </Col>
                      <Row gutter={[30, 10]}>
                        <Col>
                          <div style={{ textAlign: "center" }}>Lên kế hoạch</div>
                          <Col>
                            <Rate
                              defaultValue={item?.preparation}
                              style={{ fontSize: 18 }}
                              onChange={(value) => handlePreparationChange(item, value)}
                            />
                          </Col>
                        </Col>
                        <Col>
                          <div style={{ textAlign: "center" }}>Thực hiện</div>
                          <Col>
                            <Rate
                              defaultValue={item?.implementation}
                              style={{ fontSize: 18 }}
                              onChange={(value) => handleImplementationChange(item, value)}
                            />
                          </Col>
                        </Col>
                        <Col>
                          <div style={{ textAlign: "center" }}>Thuyết trình</div>
                          <Col>
                            <Rate
                              defaultValue={item?.presentation}
                              style={{ fontSize: 18 }}
                              onChange={(value) => handlePresentationChange(item, value)}
                            />
                          </Col>
                        </Col>
                        <Col>
                          <div style={{ textAlign: "center" }}>Sản phẩm</div>
                          <Col>
                            <Rate
                              defaultValue={item?.production}
                              style={{ fontSize: 18 }}
                              onChange={(value) => handleProductionChange(item, value)}
                            />
                          </Col>
                        </Col>
                      </Row>
                      {lesson?.status === "ONGOING" && (
                        <Col>
                          <SC.btnGreenLight onClick={() => handleSaveEvaluation(item)}>Cập nhật</SC.btnGreenLight>
                        </Col>
                      )}
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          }
        />
      </Row>
    </>
  );
}

export default memo(StudentGrade);
