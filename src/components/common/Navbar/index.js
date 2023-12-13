import { Menu, Tabs } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userInfoSelector } from "../../../redux/selector";
import "./nav-header.scss";

const rootAdminMenu = [
  {
    key: "supports",
    label: (
      <Link to="/supports">
        <div className="navbar-item">Yêu cầu hỗ trợ</div>
      </Link>
    )
  },
  {
    key: "campuses",
    label: (
      <Link to="/campuses">
        <div className="navbar-item">Danh sách Campus</div>
      </Link>
    )
  }
];
const schoolAdminMenu = [
  // {
  //   key: "gradeStatistic",
  //   label: (
  //     <Link to="/school-grade-statistics">
  //       <div className="navbar-item">Thống kê</div>
  //     </Link>
  //   )
  // }
];
const teacherMenu = [
  {
    key: "studentSubmissions",
    label: (
      <Link to="/teacher/submissions">
        <div className="navbar-item">Danh sách nộp bài</div>
      </Link>
    )
  },
  {
    key: "library",
    label: (
      <Link to="/library">
        <div className="navbar-item">Tài liệu</div>
      </Link>
    )
  },
  {
    key: "result",
    label: (
      <Link to="/results">
        <div className="navbar-item">Kết quả</div>
      </Link>
    )
  }
];
const studentMenu = [
  {
    key: "submissions",
    label: (
      <Link to="/submissions">
        <div className="navbar-item">Nộp bài</div>
      </Link>
    )
  },
  {
    key: "library",
    label: (
      <Link to="/library">
        <div className="navbar-item">Tài liệu</div>
      </Link>
    )
  }
];
const guestMenu = [];

export default function NavbarHeader() {
  const userInfo = useSelector(userInfoSelector);

  return (
    <div className="nav-header">
      <Menu
        theme="light"
        mode="horizontal"
        items={
          userInfo?.roles.includes("ROOT_ADMIN")
            ? rootAdminMenu
            : userInfo?.roles.includes("SCHOOL_ADMIN")
            ? schoolAdminMenu
            : userInfo?.roles.includes("TEACHER")
            ? teacherMenu
            : userInfo?.roles.includes("STUDENT")
            ? studentMenu
            : guestMenu
        }
      />
    </div>
  );
}
