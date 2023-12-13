import { Button, Dropdown, Space } from "antd";

import React from "react";
import "./dropdown-section.scss";

export default function DropdownSection(props) {
  return (
    <Space direction="vertical">
      <Space wrap>
        <Dropdown
          overlay={props.menuSec}
          trigger={["click"]}
          placement="bottomRight"
          arrow={{
            pointAtCenter: true
          }}
        >
          <button style={{ border: "none", cursor: "pointer", background: "transparent" }}>{props.content}</button>
        </Dropdown>
      </Space>
    </Space>
  );
}
