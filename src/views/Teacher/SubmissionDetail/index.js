import React, { useEffect, useState } from "react";
import "./style.scss";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import { Col, Row, message, Breadcrumb, Tag } from "antd";
import * as SC from "../../../components/common/CustomButton/styled";
import { useLocation, useNavigate } from "react-router-dom";
import BaseAPI from "../../../util/BaseAPI";
import * as S3 from "../../../util/S3Host";
import * as TimeUtil from "../../../util/TimeUtil";

export default function EvaluateSubmission() {
  const queryString = useLocation().search;
  const submissionId = new URLSearchParams(queryString).get("submissionId");

  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    let response = BaseAPI.get(`/submissions/${submissionId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setSubmission(res.data.item);
        } else {
          setSubmission(null);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  }, []);

  const navigate = useNavigate();
  return (
    <LayoutHomeList
      content={
        <div className="evaluate-submission">
          <Breadcrumb style={{ marginBottom: 20 }}>
            <Breadcrumb.Item onClick={() => navigate(-1)}>Danh sách nộp bài</Breadcrumb.Item>
            <Breadcrumb.Item>
              {submission?.lesson_name} - {submission?.from_id}
            </Breadcrumb.Item>
          </Breadcrumb>
          <h1>
            Môn - <b>{submission?.subject_name}</b>
          </h1>
          <div style={{ marginTop: 20 }}>
            <Row gutter={[10, 10]} align="bottom">
              <Col>Dự án:</Col>
              <Col>
                <strong>{submission?.lesson_name}</strong>
              </Col>
            </Row>
            <div>
              <Row gutter={[10, 10]} align="bottom">
                <Col>Mã số:</Col>
                <Col>
                  <strong>{submission?.from_id}</strong>
                </Col>
              </Row>
              <Row gutter={[10, 10]} align="bottom">
                <Col>Họ tên:</Col>
                <Col>
                  <strong>{submission?.from_name}</strong>
                </Col>
              </Row>
              <Row gutter={[10, 10]} align="bottom">
                <Col>Thời gian nộp:</Col>
                <Col>
                  <strong>
                    {TimeUtil.convertUTCtoDatetime(
                      submission?.update_at ? submission.update_at : submission?.create_at
                    )}
                  </strong>
                </Col>
              </Row>
              <Row gutter={[10, 10]} align="bottom">
                <Col>Trạng thái:</Col>
                <Col>
                  {submission?.status === "LATE" ? (
                    <Tag color="red">
                      <b>Muộn {TimeUtil.convertTimestampToString(submission?.late_time)}</b>
                    </Tag>
                  ) : (
                    <Tag color="green">
                      <b>Đúng hạn</b>
                    </Tag>
                  )}
                </Col>
              </Row>
            </div>
          </div>

          <hr />
          <div className="answer">
            <h3>Nội dung: </h3>
            <p className="submission-content">
              <div className="html-content-parse" dangerouslySetInnerHTML={{ __html: submission?.content }} />
            </p>
            <h3>Tệp đính kèm: </h3>
            <div>
              <a className="attachment" target={"_blank"} href={`${S3.HOST}${submission?.attachment_url}`}>
                {submission?.attachment_url?.substring(`submission/${submission?.id}/`.length)}
              </a>
            </div>
          </div>
          <hr />
        </div>
      }
    />
  );
}
