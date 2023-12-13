import { Avatar, Col, Comment, Input, message, Popconfirm, Row, Typography } from "antd";
import moment from "moment";
import React, { useState } from "react";
import "./style.scss";
import * as S3 from "../../../../util/S3Host";
import BaseAPI from "../../../../util/BaseAPI";
import Ckeditor from "react-ckeditor-component/lib/ckeditor";
import Loading from "../../../common/loading";
import * as SC from "../../../common/CustomButton/styled";
import * as TimeUtil from "../../../../util/TimeUtil";

const { Title } = Typography;

export default function CommentItem({ lessonId, comment, refresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment?.content);
  const [reply, setReply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyContent, setReplyContent] = useState(null);

  const deleteComment = () => {
    let response = BaseAPI.delete(`/comments/${comment?.id}`);
    return response
      .then((res) => {
        if (res?.status === 200) {
          message.success("Xóa bình luận thành công");
          refresh();
        } else {
          message.error(res?.response?.data?.message || "Xóa thất bại");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const actions = [
    <span
      style={{ color: "grey" }}
      onClick={() => {
        setIsEditing(false);
        setReply(true);
      }}
    >
      Trả lời
    </span>
  ];

  const ownerActions = [
    <span
      style={{ color: "grey" }}
      onClick={() => {
        setIsEditing(false);
        setReply(true);
      }}
    >
      Trả lời
    </span>,
    <span
      style={{ color: "grey" }}
      onClick={() => {
        setIsEditing(true);
        setReply(false);
      }}
    >
      Chỉnh sửa
    </span>,
    <Popconfirm title="Bạn muốn xóa bình luận này?" onConfirm={deleteComment}>
      <span style={{ color: "grey" }}>Xóa</span>
    </Popconfirm>
  ];

  const handleContentChange = (e) => {
    setContent(e.editor.getData());
  };

  const handleReplyContentChange = (e) => {
    setReplyContent(e.editor.getData());
  };

  const handleComment = () => {
    let rawContent = replyContent?.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("&nbsp;", "")?.trim();
    if (!replyContent || rawContent?.length === 0) {
      message.error("Vui lòng nhập nội dung bình luận");
    } else {
      setLoading(true);

      let response = BaseAPI.post(`/comments`, {
        lesson_id: lessonId,
        comment_id: comment?.id,
        content: replyContent
      });

      response
        .then((res) => {
          if (res?.status === 201) {
            refresh();
          }
          setLoading(false);
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
          setLoading(false);
        });
    }
  };

  const handleEdit = () => {
    let rawContent = content?.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("&nbsp;", "")?.trim();
    if (!content || rawContent?.length === 0) {
      message.error("Vui lòng nhập nội dung bình luận");
    } else {
      setLoading(true);

      let response = BaseAPI.patch(`/comments/${comment?.id}`, {
        content: content
      });

      response
        .then((res) => {
          if (res?.status === 200) {
            refresh();
          } else {
            message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          }
          setLoading(false);
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
          setLoading(false);
        });
    }
  };

  return (
    <Comment
      key={comment?.id}
      className="comment"
      actions={comment?.is_owner_comment ? ownerActions : actions}
      author={
        <b style={{ color: "black" }}>
          {comment?.is_owner_comment ? "Bạn" : `${comment.from_id} ${comment.from_name}`}
        </b>
      }
      avatar={<Avatar src={`${S3.HOST}${comment?.from_avatar_url}`} alt={comment?.from_name} />}
      content={<div className="comment-content" dangerouslySetInnerHTML={{ __html: comment?.content }} />}
      datetime={TimeUtil.convertUTCtoDatetime(comment?.update_at ? comment?.update_at : comment?.create_at)}
    >
      {isEditing && (
        <Row gutter={[10, 10]} justify={"space-between"} align={"top"}>
          <Col span={24}>
            <Title level={5}>Chỉnh sửa bình luận</Title>
            <Ckeditor
              activeClass="editor"
              content={content}
              config={{
                height: 100,
                resize_minHeight: 100,
                toolbarCanCollapse: true,
                toolbarStartupExpanded: true
              }}
              events={{
                change: handleContentChange
              }}
            />
          </Col>
          {loading ? (
            <Loading />
          ) : (
            <Row gutter={[10, 10]}>
              <Col>
                <SC.btnGray onClick={() => setIsEditing(false)}>
                  <b>Hủy bỏ</b>
                </SC.btnGray>
              </Col>
              <Col>
                <SC.btnLightGreen onClick={handleEdit}>
                  <b>Cập nhật</b>
                </SC.btnLightGreen>
              </Col>
            </Row>
          )}
        </Row>
      )}
      {reply && (
        <Row gutter={[10, 10]} justify={"space-between"} align={"top"}>
          <Col span={24}>
            <Title level={5}>Trả lời bình luận</Title>
            <Ckeditor
              activeClass="editor"
              content={replyContent}
              config={{
                height: 100,
                resize_minHeight: 100,
                toolbarCanCollapse: true,
                toolbarStartupExpanded: true
              }}
              events={{
                change: handleReplyContentChange
              }}
            />
          </Col>
          {loading ? (
            <Loading />
          ) : (
            <Row gutter={[10, 10]}>
              <Col>
                <SC.btnGray onClick={() => setReply(false)}>
                  <b>Hủy bỏ</b>
                </SC.btnGray>
              </Col>
              <Col>
                <SC.btnLightGreen onClick={handleComment}>
                  <b>Gửi</b>
                </SC.btnLightGreen>
              </Col>
            </Row>
          )}
        </Row>
      )}
      {comment?.replies &&
        comment?.replies.map((reply) => {
          return <CommentItem key={reply?.id} lessonId={lessonId} comment={reply} refresh={refresh} />;
        })}
    </Comment>
  );
}
