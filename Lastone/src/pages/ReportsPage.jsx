import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import VulnerabilityPieChart from "../components/charts/VulnerabilityPieChart";
import VulnerabilityBarChart from "../components/charts/VulnerabilityBarChart";
import ScanTrendLineChart from "../components/charts/ScanTrendLineChart";
import apiClient from "../utils/apiClient";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReport, setFilteredReport] = useState(null);
  const [searchUrl, setSearchUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch all reports on page load
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await apiClient.get("/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReports(response.data.reports || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle URL search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchUrl.trim()) return;

    try {
      setLoading(true);
      setError("");

      const res = await apiClient.get(
        `/reports/target?target=${encodeURIComponent(searchUrl)}`
      );

      if (res.data.error) {
        setFilteredReport(null);
        setError("No report found for this URL.");
      } else {
        setFilteredReport(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching report.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prepare chart data
  const pieData = reports.length
    ? [
        { type: "High", value: 5 },
        { type: "Medium", value: 10 },
        { type: "Low", value: 7 },
      ]
    : [];

  const barData = reports.map((r) => ({
    type: r.target,
    value: r.issues,
  }));

  const lineData = reports.map((r) => ({
    date: new Date(r.scanned_at).toLocaleDateString(),
    value: r.issues,
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Scan Reports Dashboard</h1>

        {/* 🔍 Search Section */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Search by URL (e.g. https://example.com)"
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-gray-600">Loading reports...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* 📊 Show specific report if searched */}
        {filteredReport ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Report for {filteredReport.target}
            </h2>
            <p>
              <strong>Status:</strong> {filteredReport.status}
            </p>
            <p>
              <strong>Issues Found:</strong> {filteredReport.issues}
            </p>
            <p>
              <strong>Scanned At:</strong>{" "}
              {new Date(filteredReport.scanned_at).toLocaleString()}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Findings:</h3>
              <ul className="list-disc list-inside space-y-1">
                {filteredReport.findings.map((f, idx) => (
                  <li key={idx}>
                    <code>{f.header}</code> — {f.value}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setFilteredReport(null)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                ← Back to All Reports
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Show aggregated dashboard only when not viewing a specific report */}
            {reports.length > 0 ? (
              <>
                <VulnerabilityPieChart data={pieData} />
                <VulnerabilityBarChart data={barData} />
                <ScanTrendLineChart data={lineData} />

                {/* List all reports */}
                <div className="bg-white p-6 rounded-lg shadow mt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    All Previous Reports
                  </h2>
                  <div className="space-y-3">
                    {reports.map((r, idx) => (
                      <div
                        key={idx}
                        className="p-4 border rounded-md hover:bg-gray-50 transition"
                      >
                        <p className="font-semibold">{r.target}</p>
                        <p>Status: {r.status}</p>
                        <p>Issues: {r.issues}</p>
                        <p className="text-sm text-gray-500">
                          Scanned: {new Date(r.scanned_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-600">No reports found yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
