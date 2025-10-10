import React, { useEffect, useState } from "react";
import "jspdf-autotable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  //  Fetch all reports on page load
  useEffect(() => {
    fetchReports();
  }, []);

  const exportReports = (format) => {
    if (!reports.length) {
      alert("No reports to export");
      return;
    }

    let dataStr, blob, fileName;

    if (format === "json") {
      dataStr = JSON.stringify(reports, null, 2);
      blob = new Blob([dataStr], { type: "application/json" });
      fileName = "reports.json";
    } else if (format === "csv") {
      const headers = Object.keys(reports[0]);
      const csvRows = [
        headers.join(","),
        ...reports.map((r) =>
          headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")
        ),
      ];
      dataStr = csvRows.join("\n");
      blob = new Blob([dataStr], { type: "text/csv" });
      fileName = "reports.csv";
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportReportsAsPDF = () => {
    if (!reports.length) {
      alert("No reports to export");
      return;
    }

    try {
      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFontSize(18);
      doc.text("Vulnerability Scan Reports", 14, 20);

      const tableColumn = ["Target", "Status", "Issues", "Scanned At"];
      const tableRows = reports.map((r) => [
        r.target || "N/A",
        r.status || "N/A",
        r.issues ?? "0",
        new Date(r.scanned_at).toLocaleString(),
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save("reports.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to generate PDF. Check console for details.");
    }
  };

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
    ? ["High", "Medium", "Low", "Info"].map((severity) => {
        const count = reports.reduce((acc, report) => {
          const issuesOfSeverity =
            report.findings?.filter((f) => f.severity === severity && (f.status === "vulnerable" || f.status === "missing-security-headers" || f.status === "possible" || f.status === "token-missing")).length || 0;
          return acc + issuesOfSeverity;
        }, 0);
        return { type: severity, value: count };
      }).filter(item => item.value > 0) // Only include severities with counts > 0
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
                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Reports Overview
                </h2>

                <VulnerabilityPieChart data={pieData} />
                <VulnerabilityBarChart data={barData} />
                <ScanTrendLineChart data={lineData} />
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => exportReports("json")}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => exportReports("csv")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={exportReportsAsPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Export as PDF
                  </button>
                </div>

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
