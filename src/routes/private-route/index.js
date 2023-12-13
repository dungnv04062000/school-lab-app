import React from "react";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../redux/selector";
import Forbidden from "../../views/Forbidden/index";

function PrivateRoute({ roleTargets, children }) {
  const userInfo = useSelector(userInfoSelector);
  if (roleTargets.includes("ALL")) {
    return children;
  } else if (roleTargets.includes("USER")) {
    if (!userInfo) {
      return <Forbidden />;
    }
    return children;
  } else {
    if (userInfo) {
      if (!userInfo.roles.some((role) => roleTargets.includes(role))) {
        return <Forbidden />;
      }
      return children;
    }
    return <Forbidden />;
  }
}

export default PrivateRoute;
