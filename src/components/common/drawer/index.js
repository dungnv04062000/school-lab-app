import { Drawer } from "antd";
import React from "react";
import "./drawer.scss";

export default function AppDrawer(props) {
  const { btnShow, onClose, open, content, title } = props;

  return (
    <>
      {btnShow}
      <Drawer title={title} className="my-drawer" placement="right" onClose={onClose} open={open}>
        {content}
      </Drawer>
    </>
  );
}
