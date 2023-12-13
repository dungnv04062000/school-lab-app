import { Avatar, Button, Col, Comment, Form, Input, List, message, Row } from "antd";
import moment from "moment";
import "./comment-detail-lesson.scss";
import { ReloadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import * as SC from "../../common/CustomButton/styled";
import BaseAPI from "../../../util/BaseAPI";
import { useLocation } from "react-router-dom";
import CommentItem from "./Comment";
import Ckeditor from "react-ckeditor-component/lib/ckeditor";
import SkeletonApp from "../../common/Skeleton";
import Loading from "../../common/loading";
import { memo } from "react";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../../redux/selector";
import * as S3 from "../../../util/S3Host";

function LessonComment() {
  const queryString = useLocation().search;
  const lessonId = new URLSearchParams(queryString).get("lessonId");

  const userInfo = useSelector(userInfoSelector);

  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    getLesson();
  }, []);

  const getLesson = () => {
    let response = BaseAPI.get(`/lessons/${lessonId}`);

    response
      .then((res) => {
        if (res?.status === 200) {
          setLesson(res.data.item);
        }
      })
      .catch((err) => {
        setLesson(null);
      });
  };

  const getComments = () => {
    let response = BaseAPI.get(`/comments/${lessonId}`, {
      params: {
        page: page
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          // setComments(res.data.items);
          if (comments?.length > 0) {
            setComments((prev) => [...prev, ...res.data.items]);
          } else {
            setComments(res.data.items);
          }
          setTotalItems(res.data.total_items);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getComments();
  }, [page]);

  const handleComment = () => {
    let rawContent = content?.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("&nbsp;", "")?.trim();
    if (!content || rawContent?.length === 0) {
      message.error("Vui lòng nhập nội dung bình luận");
    } else {
      setLoading(true);

      let response = BaseAPI.post(`/comments`, {
        lesson_id: lessonId,
        content: content
      });

      response
        .then((res) => {
          if (res?.status === 201) {
            setContent(null);
            setComments([]);
            getLesson();
            getComments();
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

  const handleContentChange = (e) => {
    setContent(e.editor.getData());
  };

  const refresh = () => {
    setComments([]);
    if (page === 1) {
      getLesson();
      getComments();
    } else {
      setPage(1);
    }
  };

  return (
    <div className="comment-detail-lesson" id="end">
      <Row>
        <SC.btnWhite onClick={refresh}>
          <ReloadOutlined />
        </SC.btnWhite>
      </Row>
      <Comment
        avatar={<Avatar src={`${S3.HOST}${userInfo?.image_url}`} alt="Han Solo" />}
        content={
          <Row gutter={[10, 10]} justify={"space-between"} align={"top"}>
            <Col span={24}>
              <Row style={{ marginBottom: 20 }}>
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
              </Row>
              {loading ? (
                <Loading />
              ) : (
                <SC.btnLightGreen type="submit" onClick={handleComment}>
                  <b>Gửi</b>
                </SC.btnLightGreen>
              )}
            </Col>
          </Row>
        }
      />

      {totalItems > 0 && (
        <SkeletonApp
          content={
            <List
              dataSource={comments}
              header={`${lesson?.count_comment} ${lesson?.count_comment > 1 ? "comments" : "comment"}`}
              footer={
                <Row justify="center">
                  {comments?.length < totalItems && (
                    <Button onClick={() => setPage((page) => page + 1)}>Tải thêm</Button>
                  )}
                </Row>
              }
              itemLayout="horizontal"
              renderItem={(item) => {
                return (
                  <List.Item key={item.id}>
                    <CommentItem lessonId={lessonId} comment={item} refresh={refresh} />
                  </List.Item>
                );
              }}
            />
          }
        />
      )}
    </div>
  );
}

export default memo(LessonComment);
