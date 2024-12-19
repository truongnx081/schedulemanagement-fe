import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomLineChart = ({ data, lines, gradients }) => {
  return (
    <ResponsiveContainer width="100%" height={480}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          {gradients.map((gradient) => (
            <linearGradient
              key={gradient.id}
              id={gradient.id}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              {gradient.stops.map((stop, index) => (
                <stop
                  key={index}
                  offset={stop.offset}
                  stopColor={stop.stopColor}
                  stopOpacity={stop.stopOpacity}
                />
              ))}
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map((line) => (
          <Area
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth || 2}
            fill={`url(#${line.gradientId})`}
            activeDot={line.activeDot || { r: 4 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
