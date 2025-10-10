import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ScanTrendLineChart = ({ data }) => {
  return (
    <div className="w-full h-64 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Scan Activity Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FF8042"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScanTrendLineChart;
