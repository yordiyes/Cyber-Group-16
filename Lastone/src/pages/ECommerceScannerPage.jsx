import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const ecommerceSections = [
  { title: "Payment Gateway", content: "Test secure payment flow and fraud detection." },
  { title: "CSRF/XSS", content: "Scan for cross-site scripting and CSRF vulnerabilities." },
  { title: "Data Leakage", content: "Ensure sensitive user data is stored and transmitted safely." },
  { title: "Inventory Security", content: "Check access control for product and order management." },
  { title: "User Account Protection", content: "Ensure proper password policies and session security." }
];

const EcommerceScannerPage = () => {
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
      <Navbar />

      <div className="max-w-4xl mx-auto mt-20 px-6">
        <h1 className="text-4xl font-bold text-center mb-6">E-commerce Scanner</h1>
        <p className="text-gray-700 text-lg text-center mb-12">
          Core vulnerability checks for e-commerce platforms: Payment Gateway, CSRF/XSS, Data Leakage, Inventory Security, User Account Protection.
        </p>

        {/* Scan Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-semibold mb-4">Scan an E-commerce URL</h2>
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
            >
              Scan
            </button>
          </div>
          {scanResult && <p className="mt-4 text-gray-600 italic">{scanResult}</p>}
        </div>

        {/* Vulnerability Sections */}
        <div className="space-y-4">
          {ecommerceSections.map((section, idx) => (
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

export default EcommerceScannerPage;
