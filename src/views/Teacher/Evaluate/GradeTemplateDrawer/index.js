import { Title } from "chart.js";
import React from "react";
import AppDrawer from "../../../../components/common/drawer";
import * as SC from "../../../../styles/common/styled";

function GradeTemplateDrawer({ lessonId, open, onClose }) {
  return (
    <>
      <AppDrawer
        content={
          <>
            <Title level={2} style={{ margin: "30px 0" }}>
              Chấm điểm theo mẫu
            </Title>
            <div
              style={{
                fontStyle: "italic",
                marginBottom: 10
              }}
            >
              Tạo và tải xuống danh sách thống kê điểm dánh giá và điềm vào cột điểm
            </div>
            <SC.btnLightGreen>Tạo danh sách</SC.btnLightGreen>
          </>
        }
        open={open}
        onClose={onClose}
      />
    </>
  );
}

export default GradeTemplateDrawer;
