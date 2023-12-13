import React, { useEffect, useState } from "react";
import SkeletonApp from "../../components/common/Skeleton";
import PageForbidden from "../Error/Error-403";

function Forbidden() {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return isShown ? <SkeletonApp content={<PageForbidden />} /> : null;
}

export default Forbidden;
