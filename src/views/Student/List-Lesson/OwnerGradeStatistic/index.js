import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import BaseAPI from "../../../../util/BaseAPI";

function OwnerGradeStatistic({ semesterId, subjectId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (semesterId) {
      getData();
    }
  }, [semesterId, subjectId]);

  const getData = () => {
    let response = BaseAPI.get(`/evaluations/owner-grade-statistic`, {
      params: {
        semester_id: semesterId,
        subject_id: subjectId
      }
    });

    response
      .then((res) => {
        if (res?.status === 200) {
          setData(res.data.items);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        setData([]);
      });
  };

  const CustomizedLabel = (props) => {
    const { x, y, stroke, value } = props;

    return (
      <text
        x={x}
        y={y}
        dy={-4}
        fill={stroke}
        style={{ fontWeight: 550, transform: "translate(0, -5px)" }}
        textAnchor="middle"
      >
        {value}
      </text>
    );
  };

  const CustomizedAxisTick = (props) => {
    const { x, y, stroke, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} style={{ fontSize: 12 }} textAnchor="end" fill="#666" transform="rotate(-45)">
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <>
      <div style={{ width: "100%", height: 500, margin: "30px 0" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              left: 20,
              right: 10,
              bottom: 40
            }}
          >
            <CartesianGrid strokeDasharray="0" />
            <XAxis
              //   label={{ value: "Ngayd", angle: 0, position: "bottom" }}
              dataKey="x"
              tick={<CustomizedAxisTick />}
              padding={{ left: 15, bottom: 20 }}
            />

            <YAxis
              type="number"
              domain={[0, 10]}
              dataKey={"y"}
              label={{
                value: `Điểm`,
                angle: -90,
                position: "insideLeft"
              }}
            />
            <Tooltip />
            <ReferenceLine y={5} stroke="blue">
              <Label position={"left"}>Đạt</Label>
            </ReferenceLine>
            <Legend verticalAlign="top" height={36} />
            <Line name="Điểm trung bình" type="linear" dataKey="y" stroke="green" label={<CustomizedLabel />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default OwnerGradeStatistic;
