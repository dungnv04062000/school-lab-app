import React from "react";
import "./style.scss";
import LoadingIcon from "../../../../assets/images/Loading_Icon.gif";

function FullScreenLoading() {
  return (
    <div className="wrapper">
      <div className="mask"></div>
      <img src={LoadingIcon} alt="loading" />
    </div>
  );
}

export default FullScreenLoading;
