import { Collapse, Empty, List, Row, Typography } from "antd";
import React, { memo, useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import SkeletonApp from "../../common/Skeleton";
import BaseAPI from "../../../util/BaseAPI";
import * as SC from "../../common/CustomButton/styled";
import Loading from "../../common/loading";

const { Title } = Typography;
const { Panel } = Collapse;

function StudentClassGroup({ lessonId }) {
  const [loading, setLoading] = useState(false);
  const [myGroup, setMyGroup] = useState({});

  useEffect(() => {
    getMyGroup();
  }, []);

  const getMyGroup = () => {
    setLoading(true);
    let response = BaseAPI.get(`/class-groups/owner/${lessonId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setMyGroup(res.data.item);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setMyGroup({});
      });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <SC.btnWhite onClick={getMyGroup} style={{ marginBottom: 10 }}>
            <ReloadOutlined />
          </SC.btnWhite>
          {myGroup?.members?.length > 0 ? (
            <>
              <Title level={5}>Nhóm của bạn</Title>
              <Collapse style={{ margin: "20px auto" }}>
                <Panel header={myGroup?.name}>
                  <List
                    size="small"
                    itemLayout="horizontal"
                    dataSource={myGroup?.members}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta title={item.member_name} description={item.member_id} />
                      </List.Item>
                    )}
                  />
                </Panel>
              </Collapse>
            </>
          ) : (
            // <Row style={{ color: "blue" }}>Bạn chưa ở trong nhóm nào</Row>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </>
      )}
    </>
  );
}

export default memo(StudentClassGroup);
