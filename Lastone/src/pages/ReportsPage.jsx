import React from "react";
import VulnerabilityPieChart from "../components/charts/VulnerabilityPieChart";
import VulnerabilityBarChart from "../components/charts/VulnerabilityBarChart";
import ScanTrendLineChart from "../components/charts/ScanTrendLineChart";

const ReportsPage = () => {
  const pieData = [
    { type: "High", value: 12 },
    { type: "Medium", value: 20 },
    { type: "Low", value: 8 },
  ];

  const barData = [
    { type: "Banking", value: 15 },
    { type: "E-commerce", value: 10 },
    { type: "Web", value: 15 },
  ];

  const lineData = [
    { date: "2025-09-25", value: 5 },
    { date: "2025-09-26", value: 10 },
    { date: "2025-09-27", value: 7 },
    { date: "2025-09-28", value: 12 },
    { date: "2025-09-29", value: 8 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Scan Reports Dashboard</h1>
      <VulnerabilityPieChart data={pieData} />
      <VulnerabilityBarChart data={barData} />
      <ScanTrendLineChart data={lineData} />
    </div>
  );
};

export default ReportsPage;
