import React from "react";
import FormEditLesson from "../../../components/common/form/form-teacher/form-edit-lesson";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import "./teacher-edit-lesson.scss";

export default function TeacherCreateLesson() {
  document.title = "Chỉnh sửa dự án";
  return (
    <LayoutHomeList
      content={
        <div className="teacher-edit-lesson">
          <FormEditLesson />
        </div>
      }
    />
  );
}
