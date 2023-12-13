import React from "react";
import "./form-teacher.scss";
import FilterHomeroomTeacher from "../../../components/common/filter/filter-homeroomTeacher";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import { Tabs } from "antd";
import TableRankingStudent from "../../../components/common/table/table-teacher/table-rankingStudent";
import TableListStudent from "../../../components/common/table/table-student/table-listStudent";
import FilterTeacherAccumulatedPoint from "../../../components/common/filter/filter-teacher/accumulate-point";
import AppLineChart from "../../../components/common/Chart/LineChart";

export default function HomeroomTeacher() {
  return (
    <LayoutHomeList
      content={
        <div className="manage-student">
          <h2>Lớp 10A3</h2>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Danh Sách học sinh" key="1">
              <div className="list-student">
                <FilterHomeroomTeacher />
                <TableListStudent />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Bảng xếp hạng" key="2">
              <div className="ranking-student">
                <FilterHomeroomTeacher />
                <TableRankingStudent />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Điểm tích lũy" key="3">
              <div className="accumulated-point">
                <FilterTeacherAccumulatedPoint />
                <AppLineChart />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      }
    />
  );
}
