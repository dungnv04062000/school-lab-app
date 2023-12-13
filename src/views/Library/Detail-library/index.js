import { Breadcrumb, Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import "./detail-library.scss";
import BaseAPI from "../../../util/BaseAPI";
import * as S3 from "../../../util/S3Host";
import * as TimeUtil from "../../../util/TimeUtil";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutHomeList from "../../../components/layouts/mainLayout";

export default function DetailLibrary() {
  const navigate = useNavigate();
  const queryString = useLocation().search;
  const libraryId = new URLSearchParams(queryString).get("libraryId");

  const [library, setLibrary] = useState(null);

  useEffect(() => {
    let response = BaseAPI.get(`/tutorials/${libraryId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setLibrary(res?.data?.item);
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  }, []);

  return (
    <LayoutHomeList
      content={
        <div className="detail-library">
          <Breadcrumb style={{ marginBottom: 20 }}>
            <Breadcrumb.Item onClick={() => navigate(-1)}>Tài liệu</Breadcrumb.Item>
            <Breadcrumb.Item>{library?.title}</Breadcrumb.Item>
          </Breadcrumb>
          <Row justify="space-between">
            <Col>
              <h2>
                Tiêu đề: <i>{library?.title}</i>
              </h2>
            </Col>
            <Col>
              <b>
                Tác giả: <i>{library?.create_by}</i>{" "}
              </b>
              <h4>
                Thời gian đăng: {"  "}
                {TimeUtil.convertUTCtoDatetime(library?.update_at ? library.update_at : library?.create_at)}
              </h4>
            </Col>
          </Row>

          <hr />
          <div className="answer">
            <h3>Mô tả: </h3>
            <div className="submission-content">
              <div
                className="html-content-parse"
                dangerouslySetInnerHTML={{
                  __html: library?.description
                }}
              />
            </div>
            <h3>Tệp đính kèm: </h3>
            <div>
              <a className="attachment" target={"_blank"} href={`${S3.HOST}${library?.attachment_url}`}>
                {library?.attachment_url?.substring(`tutorials/${library?.id}/`.length)}
              </a>
            </div>
          </div>
          <hr />
        </div>
      }
    />
  );
}
