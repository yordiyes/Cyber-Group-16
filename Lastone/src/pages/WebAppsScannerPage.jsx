import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";

const sections = [
  {
    title: "SQL Injection",
    content: "Advanced detection with safe payloads and context analysis.",
  },
  {
    title: "Cross-Site Scripting (XSS)",
    content: "Reflected XSS detection using non-executable markers.",
  },
  {
    title: "Security Headers",
    content: "Comprehensive analysis including TLS certificate validation.",
  },
  {
    title: "CSRF Protection",
    content: "Automated detection for state-changing endpoints.",
  },
  {
    title: "IDOR Testing",
    content: "Check for insecure direct object references.",
  },
  {
    title: "SSRF Detection",
    content: "Server-Side Request Forgery identification.",
  },
  { title: "Open Redirect", content: "Controlled safe redirect testing." },
];

const WebAppsScannerPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSection = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleScan = async () => {
    if (!url) {
      alert("Please enter a URL to scan!");
      return;
    }

    setLoading(true);
    setScanResult(null);

    try {
      const response = await apiClient.post("/scan", { url });
      setScanResult(response.data);
    } catch (error) {
      console.error(error);
      setScanResult({ error: "Failed to scan the URL. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-20 px-6">
        <h1 className="text-4xl font-bold text-center mb-6">
          Web Applications Scanner
        </h1>
        <p className="text-gray-700 text-lg text-center mb-12">
          Core Vulnerability Detection for your web applications: SQL Injection,
          XSS, Security Headers, CSRF, IDOR, SSRF, and Open Redirect.
        </p>

        {/* URL Input / Scan Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-semibold mb-4">Scan a URL</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Paste URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleScan}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Scanning..." : "Scan"}
            </button>
          </div>

          {/* Display scan result */}
          {scanResult && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
              {scanResult.error ? (
                <p className="text-red-600">{scanResult.error}</p>
              ) : (
                <div>
                  <p>
                    <strong>Target:</strong> {scanResult.target}
                  </p>
                  <p>
                    <strong>Status:</strong> {scanResult.status}
                  </p>
                  <p>
                    <strong>Issues Found:</strong> {scanResult.issues}
                  </p>
                  <div className="mt-2">
                    <strong>Findings:</strong>
                    <ul className="list-disc list-inside">
                      {scanResult.findings.map((item, idx) => (
                        <li key={idx}>
                          {item.type} -{" "}
                          {item.status || item.header || item.error || "N/A"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Show vulnerability descriptions only before scanning */}
        {!scanResult && (
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition hover:shadow-lg"
                onClick={() => toggleSection(idx)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <span className="text-gray-500">
                    {openIndex === idx ? "-" : "+"}
                  </span>
                </div>
                {openIndex === idx && (
                  <p className="mt-2 text-gray-600">{section.content}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/scanners"
            className="inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            ← Back to Scanners
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WebAppsScannerPage;
