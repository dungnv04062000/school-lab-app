import { Divider, message, Typography } from "antd";
import React, { useEffect, useState } from "react";
import SkeletonApp from "../../../../components/common/Skeleton";
import BaseAPI from "../../../../util/BaseAPI";
import Experiment from "../../../Notes/NoteDetail/Experiment";

function StudentExperiments({ student, lesson }) {
  const [experiments, setExperiments] = useState([]);

  useEffect(() => {
    if (student && lesson) {
      getExperiments();
    }
  }, [student, lesson]);

  const getExperiments = () => {
    let response = BaseAPI.get(`/experiments`, {
      params: {
        student_id: student?.student_id,
        lesson_id: lesson?.id
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setExperiments(res.data.items);
        } else {
          setExperiments([]);
          message.error(res?.response?.data?.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => {
        setExperiments([]);
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  const { Title } = Typography;

  return (
    student && (
      <SkeletonApp
        content={
          <>
            <Divider orientation="left">Nhật ký thí nghiệm</Divider>
            <Title level={4}>
              {student?.student_id} - {student?.student_name}
            </Title>
            {experiments.map((item) => {
              return <Experiment experiment={item} />;
            })}
          </>
        }
      />
    )
  );
}

export default StudentExperiments;
