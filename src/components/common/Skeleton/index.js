import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";

export default function SkeletonApp({ content }) {
  const [load, setLoad] = useState(true);
  useEffect(() => {
    let timeId = setTimeout(() => {
      setLoad(false);
    }, 2000);

    return () => {
      clearTimeout(timeId);
    };
  }, []);

  return (
    <Skeleton
      loading={load}
      active
      style={{ margin: "30px 0" }}
      paragraph={{
        rows: 5,
        width: 700
      }}
    >
      {content}
    </Skeleton>
  );
}
