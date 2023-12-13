import { Col, Divider, message, Row, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import BaseAPI from "../../../../util/BaseAPI";
import { SmileTwoTone, MehTwoTone, FrownTwoTone } from "@ant-design/icons";
import "./style.scss";
import Loading from "../../../common/loading";

function OwnerGrade({ lesson }) {
  const [loading, setLoading] = useState(false);
  const [grade, setGrade] = useState(null);
  useEffect(() => {
    setLoading(true);
    let response = BaseAPI.get(`/evaluations/student`, {
      params: {
        lesson_id: lesson?.id
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setGrade(res.data.item);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          setGrade(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setGrade(null);
      });
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="grade-wrapper">
      <Divider orientation="left">Nhóm của bạn</Divider>
      <Timeline style={{ margin: "0 20px" }}>
        <Timeline.Item
          color={
            grade?.hard_working >= 8
              ? "green"
              : grade?.hard_working > 6 && grade?.hard_working < 8
              ? "blue"
              : grade?.hard_working > 4 && grade?.hard_working <= 6
              ? "orange"
              : "red"
          }
        >
          <Row gutter={[10, 10]}>
            <Col xl={4} lg={6} md={8} sm={12} xs={18}>
              Chăm chỉ
            </Col>
            <Col>
              <b>{grade?.hard_working}</b>
            </Col>
          </Row>
        </Timeline.Item>
        <Timeline.Item
          color={
            grade?.skill >= 8
              ? "green"
              : grade?.skill > 6 && grade?.skill < 8
              ? "blue"
              : grade?.skill > 4 && grade?.skill <= 6
              ? "orange"
              : "red"
          }
        >
          <Row gutter={[10, 10]}>
            <Col xl={4} lg={6} md={8} sm={12} xs={18}>
              Kỹ năng
            </Col>
            <Col>
              <b>{grade?.skill}</b>
            </Col>
          </Row>
        </Timeline.Item>
        <Timeline.Item
          color={
            grade?.teamwork >= 8
              ? "green"
              : grade?.teamwork > 6 && grade?.teamwork < 8
              ? "blue"
              : grade?.teamwork > 4 && grade?.teamwork <= 6
              ? "orange"
              : "red"
          }
        >
          <Row gutter={[10, 10]}>
            <Col xl={4} lg={6} md={8} sm={12} xs={18}>
              Làm việc nhóm
            </Col>
            <Col>
              <b>{grade?.teamwork}</b>
            </Col>
          </Row>
        </Timeline.Item>
      </Timeline>
      <Divider orientation="left">Nhóm khác</Divider>
      <Timeline style={{ margin: "0 20px" }}>
        <Timeline.Item
          color={
            grade?.preparation >= 8
              ? "green"
              : grade?.preparation > 6 && grade?.preparation < 8
              ? "blue"
              : grade?.preparation > 4 && grade?.preparation <= 6
              ? "orange"
              : "red"
          }
        >
          <Row gutter={[10, 10]}>
            <Col xl={4} lg={6} md={8} sm={12} xs={18}>
              Chuẩn bị
            </Col>
            <Col>
              <b>{grade?.preparation}</b>
            </Col>
          </Row>
        </Timeline.Item>
        <Timeline.Item
          color={
            grade?.implementation >= 8
              ? "green"
              : grade?.implementation > 6 && grade?.implementation < 8
              ? "blue"
              : grade?.implementation > 4 && grade?.implementation <= 6
              ? "orange"
              : "red"
          }
        >
          <Row gutter={[10, 10]}>
            <Col xl={4} lg={6} md={8} sm={12} xs={18}>
              Thực hiện
            </Col>
            <Col>
              <b>{grade?.implementation}</b>
            </Col>
          </Row>
        </Timeline.Item>
        <Timeline.Item
          color={
            grade?.presentation >= 8
              ? "green"
              : grade?.presentation > 6 && grade?.presentation < 8
              ? "blue"
              : grade?.presentation > 4 && grade?.presentation <= 6
              ? "orange"
              : "red"
          }
        >
          <Row gutter={[10, 10]}>
            <Col xl={4} lg={6} md={8} sm={12} xs={18}>
              Thuyết trình
            </Col>
            <Col>
              <b>{grade?.presentation}</b>
            </Col>
          </Row>
        </Timeline.Item>
        <Timeline.Item
          color={
            grade?.production >= 8
              ? "green"
              : grade?.production > 6 && grade?.production < 8
              ? "blue"
              : grade?.production > 4 && grade?.production <= 6
              ? "orange"
              : "red"
          }
        >
          <Row gutter={[10, 10]}>
            <Col xl={4} lg={6} md={8} sm={12} xs={18}>
              Sản phẩm
            </Col>
            <Col>
              <b>{grade?.production}</b>
            </Col>
          </Row>
          <br />
          <br />
        </Timeline.Item>
        <Timeline.Item
          dot={
            grade?.total >= 8 ? (
              <SmileTwoTone style={{ fontSize: 20 }} twoToneColor={"green"} />
            ) : grade?.total > 6 && grade?.total < 8 ? (
              <MehTwoTone style={{ fontSize: 20 }} twoToneColor={"blue"} />
            ) : grade?.total > 4 && grade?.total <= 6 ? (
              <MehTwoTone style={{ fontSize: 20 }} twoToneColor={"orange"} />
            ) : (
              <FrownTwoTone style={{ fontSize: 20 }} twoToneColor={"red"} />
            )
          }
        >
          <Row gutter={[10, 10]}>
            <Col xl={4} lg={6} md={8} sm={12} xs={18}>
              Tổng điểm nhóm
            </Col>
            <Col>
              <b>{grade?.total}</b>
            </Col>
          </Row>
        </Timeline.Item>
      </Timeline>
      <Divider orientation="left">Giáo viên</Divider>
      <Timeline style={{ margin: "0 20px" }}>
        <Timeline.Item
          dot={
            grade?.grade >= 8 ? (
              <SmileTwoTone style={{ fontSize: 20 }} twoToneColor={"green"} />
            ) : grade?.grade > 6 && grade?.grade < 8 ? (
              <MehTwoTone style={{ fontSize: 20 }} twoToneColor={"blue"} />
            ) : grade?.grade > 4 && grade?.grade <= 6 ? (
              <MehTwoTone style={{ fontSize: 20 }} twoToneColor={"orange"} />
            ) : (
              <FrownTwoTone style={{ fontSize: 20 }} twoToneColor={"red"} />
            )
          }
        >
          <Row gutter={[10, 10]}>
            <Col xl={4} lg={6} md={8} sm={12} xs={18}>
              Điểm
            </Col>
            {grade?.grade ? (
              <Col>
                <b
                  style={{
                    color:
                      grade?.grade >= 8
                        ? "green"
                        : grade?.grade > 6 && grade?.grade < 8
                        ? "blue"
                        : grade?.grade > 4 && grade?.grade <= 6
                        ? "orange"
                        : "red"
                  }}
                >
                  {grade?.grade || ""}
                </b>
              </Col>
            ) : (
              "Chưa có"
            )}
          </Row>
        </Timeline.Item>
      </Timeline>
    </div>
  );
}

export default OwnerGrade;
