import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Loading(props) {
  const loadingIcon = (
    // <LoadingOutlined
    //   style={{
    //     fontSize: 24,
    //     color: props.color === "white" ? "white" : "#45B5BC"
    //   }}
    //   spin
    // />
    <Spin />
  );

  return <Spin indicator={loadingIcon} />;
}
