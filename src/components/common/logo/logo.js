import React from "react";
import imageLogo from "../../../assets/images/logoHeader2.png";

export default function LogoHeader() {
  return (
    <div>
      <img className="header-logo" src={imageLogo} alt="School Lab" style={{ width: "100px", height: "auto" }} />
    </div>
  );
}
