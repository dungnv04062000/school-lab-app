import { message, Row, Col } from "antd";
import "./submit-lab-content.scss";
import React, { memo, useEffect, useState } from "react";
import { CloudUploadOutlined, ReloadOutlined } from "@ant-design/icons";
import * as SC from "../../common/CustomButton/styled";
import Dragger from "antd/lib/upload/Dragger";
import CKEditor from "react-ckeditor-component";
import MultipartFormDataAPI from "../../../util/MultipartFormDataAPI";
import BaseAPI from "../../../util/BaseAPI";
import * as S3 from "../../../util/S3Host";
import * as TimeUtil from "../../../util/TimeUtil";
import Loading from "../../common/loading";

function SubmitForm({ lesson }) {
  const [file, setFile] = useState(null);
  const [isValidFile, setIsValidFile] = useState(true);

  const [loading, setLoading] = useState(false);

  const [submission, setSubmission] = useState(null);
  const [content, setContent] = useState(null);

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    getSubmission();
  }, []);

  const refresh = () => {
    setEditable(false);
    getSubmission();
  };
  const getSubmission = () => {
    let response = BaseAPI.get(`/submissions/lessons/${lesson.id}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setSubmission(res.data.item);
        } else {
          setSubmission(null);
        }
      })
      .catch((err) => {
        setSubmission(null);
      });
  };

  const onEditSubmission = () => {
    setEditable(true);
  };

  const onCancelEditSubmission = () => {
    setEditable(false);
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
      setIsValidFile(false);
      message.error("Kích thước file này đã vượt quá 25MB, không thể tải lên");
      return false;
    } else {
      setIsValidFile(true);
      return true;
    }
  };

  const onRemove = () => {
    setFile({});
    setIsValidFile(true);
  };

  const props = {
    name: "file",
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

  const handleContentChange = (e) => {
    setContent(e.editor.getData());
  };

  const handleSubmit = () => {
    if (!file) {
      message.error("Vui lòng chọn file để tải lên");
    } else {
      setLoading(true);
      let response = MultipartFormDataAPI.post("/submissions", {
        lessonId: lesson.id,
        content: content,
        file: file
      });

      response
        .then((res) => {
          if (res?.status === 201) {
            message.success("Nộp bài thành công");
            refresh();
          } else {
            message.error(res?.response?.data?.message || "Có lỗi xảy ra khi nộp bài");
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        });
    }
  };

  const handleSubmitAgain = () => {
    setLoading(true);
    let response = MultipartFormDataAPI.patch(`/submissions/${submission.id}`, {
      content: content,
      file: file
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Nộp bài thành công");
          refresh();
        } else {
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
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
      <SC.btnWhite onClick={refresh} style={{ marginBottom: 10 }}>
        <ReloadOutlined />
      </SC.btnWhite>
      {lesson?.status === "ONGOING" ? (
        !submission ? (
          <>
            <h3>Nội dung</h3>

            <Row className="submit-lab-content" id="end">
              <CKEditor
                activeClass="editor"
                content={content}
                events={{
                  change: handleContentChange
                }}
              />
            </Row>
            <Dragger maxCount={1} {...props} style={{ width: "100%" }}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">Chọn hoặc kéo thả file vào đây để tải lên</p>
              <p className="ant-upload-hint warning">
                Nếu có nhiều hơn 1 tệp cần nộp, hãy nén tất cả lại nhé
                <br />
                Vui lòng tải lên file có kích thước nhỏ hơn 25MB
              </p>
            </Dragger>
            <Row justify="space-between" style={{ marginTop: 20 }}>
              <Col className="warning">
                {isValidFile ? (
                  loading ? (
                    <Loading />
                  ) : (
                    <SC.btnLightGreen onClick={handleSubmit}>Nộp bài</SC.btnLightGreen>
                  )
                ) : (
                  "Kích thước file này đã vượt quá 25MB, không thể tải lên"
                )}
              </Col>
            </Row>
          </>
        ) : !editable ? (
          <Col>
            <h3>Nội dung</h3>
            <Row style={{ marginBottom: 20, border: "1px solid #adadad", padding: "10px 20px" }}>
              <div
                // className="html-submit-content-parse"
                dangerouslySetInnerHTML={{
                  __html: submission?.content?.length > 0 ? submission?.content : "Không có nội dung"
                }}
              />
            </Row>
            <h3>Tệp đính kèm</h3>
            <Row style={{ marginBottom: 20 }}>
              {submission?.attachment_url && (
                <a href={`${S3.HOST}${submission?.attachment_url}`}>
                  {submission?.attachment_url?.substring(`submission/${submission?.id}/`.length)}
                </a>
              )}
            </Row>
            <Row style={{ fontStyle: "italic", fontWeight: 550, marginBottom: 20 }}>
              Đã nộp lúc:{" "}
              {TimeUtil.convertUTCtoDatetime(submission?.update_at ? submission.update_at : submission?.create_at)}
            </Row>
            {lesson?.status === "ONGOING" && (
              <Row>
                <SC.btnRed onClick={onEditSubmission}>Nộp lại</SC.btnRed>
              </Row>
            )}
          </Col>
        ) : (
          <>
            <h3>Nội dung</h3>
            <Row className="submit-lab-content" id="end">
              {/* <TextArea className="content" rows={7} bordered={false} /> */}
              <CKEditor
                activeClass="editor"
                content={content}
                events={{
                  change: handleContentChange
                }}
              />
            </Row>
            <Dragger maxCount={1} {...props} style={{ width: "100%" }}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">Chọn hoặc kéo thả file vào đây để tải lên</p>
              <p className="ant-upload-hint warning">
                Nếu có nhiều hơn 1 tệp cần nộp, hãy nén tất cả lại nhé
                <br />
                Vui lòng tải lên file có kích thước nhỏ hơn 25MB
              </p>
            </Dragger>
            <Row justify="space-between" style={{ marginTop: 20 }}>
              <Col className="warning">
                <SC.btnGray onClick={onCancelEditSubmission} style={{ marginRight: 10 }}>
                  Hủy bỏ
                </SC.btnGray>
                {isValidFile ? (
                  loading ? (
                    <Loading />
                  ) : (
                    <SC.btnLightGreen onClick={handleSubmitAgain}>Nộp bài</SC.btnLightGreen>
                  )
                ) : (
                  "Kích thước file này đã vượt quá 25MB, không thể tải lên"
                )}
              </Col>
            </Row>
          </>
        )
      ) : submission ? (
        <Col>
          <h3>Nội dung</h3>
          <Row style={{ marginBottom: 20, border: "1px solid #adadad", padding: "10px 20px" }}>
            <div className="html-submit-content-parse" dangerouslySetInnerHTML={{ __html: submission?.content }} />
          </Row>
          <h3>Tệp đính kèm</h3>
          <Row style={{ marginBottom: 20 }}>
            {submission?.attachment_url && (
              <a href={`${S3.HOST}${submission?.attachment_url}`}>
                {submission?.attachment_url?.substring(`submission/${submission?.id}/`.length)}
              </a>
            )}
          </Row>
          <Row style={{ fontStyle: "italic", fontWeight: 550, marginBottom: 20 }}>
            Đã nộp lúc:{" "}
            {TimeUtil.convertUTCtoDatetime(submission?.update_at ? submission.update_at : submission?.create_at)}
          </Row>
        </Col>
      ) : (
        <Row>Bạn chưa nộp bài cho dự án này</Row>
      )}
    </>
  );
}

export default memo(SubmitForm);
