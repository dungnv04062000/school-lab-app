import { Select, Col, Form, Input, Row, Divider, DatePicker, Breadcrumb, message } from "antd";
import React, { useEffect, useState } from "react";
import "./form-create-lesson.scss";
import * as SC from "../../../CustomButton/styled";
import MultipartAPI from "../../../../../util/MultipartFormDataAPI";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dragger from "antd/lib/upload/Dragger";
import { CloudUploadOutlined } from "@ant-design/icons";
import moment from "moment";
import * as S3 from "../../../../../util/S3Host";
import Loading from "../../../loading";
import TextArea from "antd/lib/input/TextArea";
import { useRef } from "react";
import BaseAPI from "../../../../../util/BaseAPI";
import Ckeditor from "react-ckeditor-component/lib/ckeditor";

const { Option } = Select;

export default function FormEditLesson() {
  const queryString = useLocation().search;
  const lessonId = new URLSearchParams(queryString).get("lessonId");

  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    let lessonResponse = BaseAPI.get(`/lessons/${lessonId}`);
    lessonResponse
      .then((res) => {
        if (res?.status === 200) {
          setLesson(res.data.item);
        } else {
          setLesson(null);
        }
      })
      .catch((err) => {
        setLesson(null);
      });
  }, []);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [context, setContext] = useState(null);
  const [goal, setGoal] = useState(null);
  const [level, setLevel] = useState(1);
  const [endAt, setEndAt] = useState(undefined);

  const [file, setFile] = useState(null);
  const [isValidFile, setIsValidFile] = useState(true);

  const [form] = Form.useForm();

  const titleRef = useRef();
  const scienceRef = useRef();
  const tecnologyRef = useRef();
  const engineeringRef = useRef();
  const mathematicsRef = useRef();
  const preparationRef = useRef();
  const implementationRef = useRef();
  const presentationRef = useRef();
  const productionRef = useRef();

  useEffect(() => {
    if (lesson) {
      form.setFieldsValue({
        title: lesson?.title,
        science: lesson?.science ? lesson?.science.replaceAll("<br/>", "\n") : "",
        technology: lesson?.technology ? lesson?.technology.replaceAll("<br/>", "\n") : "",
        engineering: lesson?.engineering ? lesson?.engineering.replaceAll("<br/>", "\n") : "",
        mathematics: lesson?.mathematics ? lesson?.mathematics.replaceAll("<br/>", "\n") : "",
        preparation: Number(lesson?.preparation || 0),
        implementation: Number(lesson?.implementation || 0),
        presentation: Number(lesson?.presentation || 0),
        production: Number(lesson?.production || 0)
      });
      setContext(lesson.context);
      setGoal(lesson.goal);
      setLevel(lesson.level_id);
      setEndAt(lesson.end_at);
    }
  }, [lesson]);

  const handleContextChange = (e) => {
    setContext(e.editor.getData().trim());
  };

  const handleGoalChange = (e) => {
    setGoal(e.editor.getData().trim());
  };

  const handleLevelChange = (value) => {
    setLevel(value);
  };

  const handleEndAtChange = (value) => {
    setEndAt(value?.unix() || null);
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

  const onSave = (values) => {
    let totalPercetage =
      parseInt(preparationRef.current.input.value) +
      parseInt(implementationRef.current.input.value) +
      parseInt(presentationRef.current.input.value) +
      parseInt(productionRef.current.input.value);
    if (totalPercetage !== 100) {
      message.error("Tổng các tiêu chí phải bằng 100");
    } else if (!titleRef.current.input.value?.trim()) {
      message.error("Tên dự án không được để trống");
    } else {
      setLoading(true);
      var formData = new FormData();
      formData.append("title", titleRef.current.input.value);
      formData.append("context", context);
      formData.append("goal", goal);
      formData.append("levelId", level);
      formData.append("endAt", endAt);
      formData.append("science", scienceRef.current.resizableTextArea.textArea.value);
      formData.append("technology", tecnologyRef.current.resizableTextArea.textArea.value);
      formData.append("engineering", engineeringRef.current.resizableTextArea.textArea.value);
      formData.append("mathematics", mathematicsRef.current.resizableTextArea.textArea.value);
      formData.append("preparation", preparationRef.current.input.value);
      formData.append("implementation", implementationRef.current.input.value);
      formData.append("presentation", presentationRef.current.input.value);
      formData.append("production", productionRef.current.input.value);
      formData.append("file", file);
      let updateLessonResponse = MultipartAPI.patch(`/lessons/${lesson?.id}`, formData);

      updateLessonResponse
        .then((res) => {
          if (res?.status === 200) {
            message.success(`Cập nhật dự án thành công`);
            setLoading(false);
            navigate(`/teacher/lessons/detail?lessonId=${lesson?.id}`);
          } else {
            setLoading(false);
            message.error(res?.response?.data?.message || "Có lỗi xảy ra");
          }
        })
        .catch((err) => {
          setLoading(false);
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        });
    }
  };

  return (
    <div className="form-create-lab">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={`/teacher/classes/lessons?classId=${lesson?.class_id}`}>{lesson?.class_name}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h2>Chỉnh sửa dự án</h2>
      <Form onFinish={onSave} autoComplete="off" form={form}>
        <Row justify="space-between">
          <Col xs={24} sm={5} md={5} lg={5} xl={5}>
            <h4>Môn học</h4>
            <Input type="text" size="large" disabled value={lesson?.subject_name} />
          </Col>
          <Col xs={24} sm={18} md={18} lg={18} xl={18}>
            <h4>Tiêu đề - Tên dự án</h4>
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên dự án"
                },
                {
                  pattern: /.*[A-Za-z0-9].*/,
                  message: "Tên dự án không được để trống"
                }
              ]}
            >
              <Input size="large" ref={titleRef} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginBottom: 20 }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Divider orientation="left">Thông tin dự án</Divider>
            <h4>Lý do / Hiện trạng</h4>
            <Form.Item name="context">
              <Ckeditor
                activeClass="editor"
                content={context}
                // config={{
                //   toolbarCanCollapse: true,
                //   toolbarStartupExpanded: false
                // }}
                events={{
                  blur: handleContextChange
                }}
              />
            </Form.Item>
            <h4>Mục tiêu đạt được của dự án</h4>
            <Form.Item
            // rules={[
            //   {
            //     required: true,
            //     message: "Vui lòng nhập tên Mục tiêu đạt được của dự án"
            //   }
            // ]}
            >
              <Ckeditor
                activeClass="editor"
                content={goal}
                // config={{
                //   toolbarCanCollapse: true,
                //   toolbarStartupExpanded: false
                // }}
                events={{
                  blur: handleGoalChange
                }}
              />
            </Form.Item>
            <Row justify="space-between">
              <Col xs={24} sm={11} md={11} lg={11} xl={10}>
                <Form.Item name="level">
                  <h4>Mức độ của dự án</h4>
                  <Select size="large" defaultValue={1} value={level} onChange={handleLevelChange}>
                    <Option value={1}>Đơn giản</Option>
                    <Option value={2}>Trung bình</Option>
                    <Option value={3}>Phức tạp</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={11} md={11} lg={11} xl={10}>
                <Form.Item>
                  <h4>Thời hạn nộp bài (Tùy chọn)</h4>
                  <DatePicker
                    showTime={{
                      format: "HH:mm"
                    }}
                    size="large"
                    format={"DD-MM-yyyy HH:mm"}
                    onChange={handleEndAtChange}
                    value={endAt ? moment.unix(endAt) : null}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">Tệp đính kèm</Divider>
            <Row>
              {lesson?.attachment_url && (
                <a className="attachment" target={"_blank"} href={`${S3.HOST}${lesson?.attachment_url}`}>
                  {lesson?.attachment_url?.substring(`lessons/${lesson?.id}/`.length)}
                </a>
              )}
            </Row>
            Tải lên và ghi đè tệp đính kèm đã có
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
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={11}>
            <Divider orientation="left">Kiến thức STEM</Divider>
            <h4>Khoa học (S - Science)</h4>
            <Form.Item name="science">
              <TextArea rows={4} ref={scienceRef} />
            </Form.Item>
            <h4>Công nghệ (T - Technology)</h4>
            <Form.Item name="technology">
              <TextArea rows={4} ref={tecnologyRef} />
            </Form.Item>
            <h4>Kỹ thuật (E - Engineering)</h4>
            <Form.Item name="engineering">
              <TextArea rows={4} ref={engineeringRef} />
            </Form.Item>
            <h4>Toán học (M - Mathematics)</h4>
            <Form.Item name="mathematics">
              <TextArea rows={4} ref={mathematicsRef} />
            </Form.Item>
            <Divider orientation="left">Tiêu chí đánh giá điểm</Divider>
            <Row justify="space-between">
              <Col span={11}>
                <h4>Giai đoạn chuẩn bị (%)</h4>
                <Form.Item
                  name="preparation"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập dữ liệu"
                    }
                  ]}
                >
                  <Input type="number" min={0} max={100} size="large" ref={preparationRef} />
                </Form.Item>
                <h4>Giai đoạn thực hiện (%)</h4>
                <Form.Item
                  name="implementation"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập dữ liệu"
                    }
                  ]}
                >
                  <Input type="number" min={0} max={100} size="large" ref={implementationRef} />
                </Form.Item>
              </Col>
              <Col span={11}>
                <h4>Thuyết trình (%)</h4>
                <Form.Item
                  name="presentation"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập dữ liệu"
                    }
                  ]}
                >
                  <Input type="number" min={0} max={100} size="large" ref={presentationRef} />
                </Form.Item>
                <h4>Sản phẩm (%)</h4>
                <Form.Item
                  name="production"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập dữ liệu"
                    }
                  ]}
                >
                  <Input type="number" min={0} max={100} size="large" ref={productionRef} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[10, 10]} justify="start" align="middle">
          <Col>
            <Form.Item>
              <SC.btnCancel onClick={() => navigate(-1)}>Hủy bỏ</SC.btnCancel>
            </Form.Item>
          </Col>
          {isValidFile ? (
            <Col>
              <Form.Item>
                {loading ? <Loading /> : <SC.btnLightGreen type="submit">Cập nhật</SC.btnLightGreen>}
              </Form.Item>
            </Col>
          ) : (
            <Col style={{ color: "red", fontStyle: "italic" }}>
              Kích thước file này đã vượt quá 25MB, không thể tải lên
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
}
