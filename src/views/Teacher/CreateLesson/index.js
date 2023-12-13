import React from "react";
import { useLocation } from "react-router-dom";
import FormCreateLesson from "../../../components/common/form/form-teacher/form-create-lesson";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import "./teacher-create-lesson.scss";

export default function TeacherCreateLesson() {
  const queryString = useLocation().search;
  const classId = new URLSearchParams(queryString).get("classId");

  return (
    <LayoutHomeList
      content={
        <div className="teacher-create-lesson">
          <FormCreateLesson classId={classId} />
        </div>
      }
    />
  );
}
