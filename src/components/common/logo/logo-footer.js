import React from "react";
import imageLogo from "../../../assets/images/logoFooter2.png";
export default function LogoFooter() {
  return (
    <div>
      <img
        className="header-logo"
        src={imageLogo}
        alt="School Lab"
        style={{ width: "150px", height: "auto", marginTop: "30px" }}
      />
    </div>
  );
}
