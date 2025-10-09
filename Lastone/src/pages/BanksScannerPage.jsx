import React, { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";

const bankSections = [
  {
    title: "Authentication",
    content: "Check login, 2FA, and session security.",
  },
  {
    title: "Transaction Security",
    content: "Ensure transactions are encrypted and tamper-proof.",
  },
  {
    title: "Sensitive Data Exposure",
    content: "Audit for PII or financial data leaks.",
  },
  {
    title: "Fraud Detection",
    content: "Simulate attacks to test fraud detection mechanisms.",
  },
  {
    title: "Compliance",
    content: "Check compliance with banking regulations (PCI DSS, GDPR).",
  },
];

const BankScannerPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSection = (i) => setOpenIndex(openIndex === i ? null : i);

  // ✅ Backend scan request
  const handleScan = async () => {
    if (!url) {
      alert("Please enter a Bank URL to scan!");
      return;
    }

    setLoading(true);
    setScanResult(null);

    try {
      const response = await apiClient.post("/scan/banking/banking", { url });
      setScanResult(response.data);
    } catch (error) {
      console.error("Scan error:", error);
      setScanResult({
        error: "Failed to scan the URL. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto mt-20 px-6">
        <h1 className="text-4xl font-bold text-center mb-6">Banking Scanner</h1>
        <p className="text-gray-700 text-lg text-center mb-12">
          Core vulnerability checks for online banking platforms:
          Authentication, Transaction Security, Sensitive Data Exposure, Fraud
          Detection, and Compliance.
        </p>

        {/* Scan Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-semibold mb-4">Scan a Bank URL</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Paste Bank URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleScan}
              disabled={loading}
              className={`px-6 py-2 text-white rounded-md transition ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Scanning..." : "Scan"}
            </button>
          </div>

          {/* Scan Results */}
          {scanResult && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4">
              {scanResult.error ? (
                <p className="text-red-600">{scanResult.error}</p>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    Scan Completed
                  </h3>
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
                    <strong>Scanned By:</strong> {scanResult.scanned_by}
                  </p>
                  <p>
                    <strong>Scan Type:</strong> {scanResult.type}
                  </p>

                  {scanResult.findings && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Findings:</h4>
                      <ul className="list-disc ml-6 space-y-2 text-gray-700">
                        {scanResult.findings.map((finding, idx) => (
                          <li key={idx} className="border-b pb-2">
                            <p>
                              <strong>Type:</strong> {finding.type || "Unknown"}
                            </p>

                            {finding.header && (
                              <p>
                                <strong>Header:</strong> {finding.header} ={" "}
                                <span className="text-blue-600">
                                  {finding.value}
                                </span>
                              </p>
                            )}

                            {finding.status && (
                              <p>
                                <strong>Status:</strong> {finding.status}
                              </p>
                            )}

                            {finding.missing && (
                              <div>
                                <strong>Missing Headers:</strong>
                                <ul className="list-disc ml-6 text-red-600">
                                  {finding.missing.map((h, i) => (
                                    <li key={i}>{h}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {finding.detail && (
                              <p className="text-yellow-700">
                                <strong>Detail:</strong> {finding.detail}
                              </p>
                            )}

                            {finding.error && (
                              <p className="text-red-600">
                                <strong>Error:</strong> {finding.error}
                              </p>
                            )}

                            {finding.severity && (
                              <p>
                                <strong>Severity:</strong>{" "}
                                <span
                                  className={`${
                                    finding.severity === "critical"
                                      ? "text-red-700 font-semibold"
                                      : finding.severity === "high"
                                      ? "text-orange-600 font-semibold"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {finding.severity}
                                </span>
                              </p>
                            )}

                            {finding.target && (
                              <p className="text-sm text-gray-500">
                                <strong>Target:</strong> {finding.target}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Vulnerability Info */}
        {!scanResult && (
          <div className="space-y-4">
            {bankSections.map((section, idx) => (
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

export default BankScannerPage;
