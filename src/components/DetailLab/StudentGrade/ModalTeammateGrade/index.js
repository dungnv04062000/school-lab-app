import { Button, message, Modal, Rate, Table } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import BaseAPI from "../../../../util/BaseAPI";
import SkeletonApp from "../../../common/Skeleton";

function ModalTeammateGrade({ lesson, open, onClose }) {
  const [grades, setGrades] = useState([]);

  const [confirmLoadingTeammateGrade, setConfirmLoadingTeammateGrade] = useState(false);

  const handleSubmitTeammateGrade = () => {
    setConfirmLoadingTeammateGrade(true);
    let requestBody = [];
    grades.forEach((item) => {
      requestBody.push({
        to_id: item.to_id,
        lesson_id: lesson.id,
        hard_working: item.hard_working,
        teamwork: item.teamwork,
        skill: item.skill
      });
    });
    let response = BaseAPI.post(`/evaluations/teammates`, {
      teammates: requestBody
    });

    response
      .then((res) => {
        if (res?.status === 201) {
          message.success("Đánh giá thành công");
          getEvaluationTeamates();
          onClose();
        } else {
          message.error(res?.response?.data?.message || "Đánh giá thất bại");
        }
        setConfirmLoadingTeammateGrade(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        setConfirmLoadingTeammateGrade(false);
      });
  };

  useEffect(() => {
    getEvaluationTeamates();
  }, []);

  const getEvaluationTeamates = () => {
    let response = BaseAPI.get(`/evaluations/teammates`, {
      params: {
        lesson_id: lesson?.id
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setGrades(res.data.items);
        } else {
          setGrades([]);
        }
      })
      .catch((err) => {
        setGrades([]);
      });
  };

  const handleHardWorkingChange = (member, value) => {
    setGrades((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          hard_working: item.to_id === member.to_id ? value : item.hard_working
        };
      });
    });
  };

  const handleTeamworChange = (member, value) => {
    setGrades((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          teamwork: item.to_id === member.to_id ? value : item.teamwork
        };
      });
    });
  };

  const handleSkillChange = (member, value) => {
    setGrades((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          skill: item.to_id === member.to_id ? value : item.skill
        };
      });
    });
  };

  const columns = [
    {
      title: "Mã số",
      dataIndex: "to_id",
      key: "toId",
      width: "150px",
      render: (text) => <b>{text}</b>
    },
    {
      title: "Họ tên",
      dataIndex: "to_name",
      key: "toName",
      width: "250px"
    },
    {
      title: "Chăm chỉ",
      dataIndex: "hard_working",
      key: "hardWorking",
      width: "170px",
      render: (value, item, index) => {
        return (
          <Rate
            defaultValue={value}
            style={{ fontSize: 18 }}
            onChange={(value) => handleHardWorkingChange(item, value)}
          />
        );
      }
    },
    {
      title: "Làm việc nhóm",
      dataIndex: "teamwork",
      key: "teamwork",
      width: "170px",
      render: (value, item, index) => {
        return (
          <Rate defaultValue={value} style={{ fontSize: 18 }} onChange={(value) => handleTeamworChange(item, value)} />
        );
      }
    },
    {
      title: "Kỹ năng",
      dataIndex: "skill",
      key: "skill",
      width: "170px",
      render: (value, item, index) => {
        return (
          <Rate defaultValue={value} style={{ fontSize: 18 }} onChange={(value) => handleSkillChange(item, value)} />
        );
      }
    }
  ];
  return (
    <Modal
      title="Đánh giá thành viên trong nhóm"
      open={open}
      onOk={handleSubmitTeammateGrade}
      confirmLoading={confirmLoadingTeammateGrade}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="back" onClick={onClose}>
          Đóng
        </Button>,

        <Button
          key="submit"
          type="primary"
          loading={confirmLoadingTeammateGrade}
          onClick={handleSubmitTeammateGrade}
          disabled={lesson?.status !== "ONGOING"}
        >
          Lưu
        </Button>
      ]}
    >
      <SkeletonApp
        content={<Table rowKey={"to_id"} size="small" columns={columns} dataSource={grades} pagination={false} />}
      />
    </Modal>
  );
}

export default ModalTeammateGrade;
