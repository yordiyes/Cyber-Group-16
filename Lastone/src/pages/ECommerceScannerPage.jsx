import React, { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";

const ecommerceSections = [
  {
    title: "Payment Gateway",
    content: "Test secure payment flow and fraud detection.",
  },
  {
    title: "CSRF/XSS",
    content: "Scan for cross-site scripting and CSRF vulnerabilities.",
  },
  {
    title: "Data Leakage",
    content: "Ensure sensitive user data is stored and transmitted safely.",
  },
  {
    title: "Inventory Security",
    content: "Check access control for product and order management.",
  },
  {
    title: "User Account Protection",
    content: "Ensure proper password policies and session security.",
  },
];

const EcommerceScannerPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSection = (i) => setOpenIndex(openIndex === i ? null : i);

  const handleScan = async () => {
    if (!url) {
      alert("Please enter an E-commerce URL to scan!");
      return;
    }

    setLoading(true);
    setScanResult(null);

    try {
      // ✅ Make backend request
      const response = await apiClient.post("/scan/ecommerce/ecommerce", { url });
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
      <div className="max-w-4xl mx-auto mt-20 px-6">
        <h1 className="text-4xl font-bold text-center mb-6">
          E-commerce Scanner
        </h1>
        <p className="text-gray-700 text-lg text-center mb-12">
          Core vulnerability checks for e-commerce platforms: Payment Gateway,
          CSRF/XSS, Data Leakage, Inventory Security, and User Account
          Protection.
        </p>

        {/* URL Input / Scan Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Scan an E-commerce URL
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Paste E-commerce URL here..."
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

          {/* Display Scan Result */}
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
                  <p>
                    <strong>Scanned At:</strong>{" "}
                    {new Date(scanResult.scanned_at).toLocaleString()}
                  </p>

                  {scanResult.findings && scanResult.findings.length > 0 ? (
                    <div className="mt-4">
                      <strong>Findings:</strong>
                      <ul className="list-disc ml-6 space-y-2 text-gray-700">
                        {scanResult.findings.map((item, idx) => (
                          <li key={idx} className="border-b pb-2">
                            <p>
                              <strong>Type:</strong> {item.type || "Unknown"}
                            </p>

                            {item.header && (
                              <p>
                                <strong>Header:</strong> {item.header} ={" "}
                                <span className="text-blue-600">
                                  {item.value}
                                </span>
                              </p>
                            )}

                            {item.status && (
                              <p>
                                <strong>Status:</strong> {item.status}
                              </p>
                            )}

                            {item.missing && (
                              <div>
                                <strong>Missing Headers:</strong>
                                <ul className="list-disc ml-6 text-red-600">
                                  {item.missing.map((h, i) => (
                                    <li key={i}>{h}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {item.detail && (
                              <p className="text-yellow-700">
                                <strong>Detail:</strong> {item.detail}
                              </p>
                            )}

                            {item.error && (
                              <p className="text-red-600">
                                <strong>Error:</strong> {item.error}
                              </p>
                            )}

                            {item.severity && (
                              <p>
                                <strong>Severity:</strong>{" "}
                                <span
                                  className={
                                    item.severity === "critical"
                                      ? "text-red-700 font-semibold"
                                      : item.severity === "high"
                                      ? "text-orange-600 font-semibold"
                                      : "text-gray-700"
                                  }
                                >
                                  {item.severity}
                                </span>
                              </p>
                            )}

                            {item.target && (
                              <p className="text-sm text-gray-500">
                                <strong>Target:</strong> {item.target}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No issues found 🎉</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Show vulnerability descriptions only before scanning */}
        {!scanResult && (
          <div className="space-y-4">
            {ecommerceSections.map((section, idx) => (
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

export default EcommerceScannerPage;
