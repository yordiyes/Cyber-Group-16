import React, { useState } from "react";

import { Link } from "react-router-dom";

const bankSections = [
  { title: "Authentication", content: "Check login, 2FA, and session security." },
  { title: "Transaction Security", content: "Ensure transactions are encrypted and tamper-proof." },
  { title: "Sensitive Data Exposure", content: "Audit for PII or financial data leaks." },
  { title: "Fraud Detection", content: "Simulate attacks to test fraud detection mechanisms." },
  { title: "Compliance", content: "Check compliance with banking regulations (PCI DSS, GDPR)." }
];

const BankScannerPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);

  const toggleSection = (i) => setOpenIndex(openIndex === i ? null : i);
  const handleScan = () => {
    if (!url) return alert("Please enter a URL to scan!");
    setScanResult(`Scanning ${url}... (UI only, no backend yet)`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
  

      <div className="max-w-4xl mx-auto mt-20 px-6">
        <h1 className="text-4xl font-bold text-center mb-6">Banking Scanner</h1>
        <p className="text-gray-700 text-lg text-center mb-12">
          Core vulnerability checks for online banking platforms: Authentication, Transaction Security, Sensitive Data Exposure, Fraud Detection, Compliance.
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
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Scan
            </button>
          </div>
          {scanResult && <p className="mt-4 text-gray-600 italic">{scanResult}</p>}
        </div>

        {/* Vulnerability Sections */}
        <div className="space-y-4">
          {bankSections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition hover:shadow-lg"
              onClick={() => toggleSection(idx)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <span className="text-gray-500">{openIndex === idx ? "-" : "+"}</span>
              </div>
              {openIndex === idx && (
                <p className="mt-2 text-gray-600">{section.content}</p>
              )}
            </div>
          ))}
        </div>

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
