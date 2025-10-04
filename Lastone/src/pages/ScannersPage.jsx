import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const scanners = [
  {
    title: "For Web Applications",
    description: "Scan websites and APIs for SQL injection, vulnerable JS, XSS, and more.",
    link: "/webapps",
    icon: "🌐",
    color: "text-yellow-500",
    viewText: "View Application Scanner",
    sections: [
      { title: "SQL Injection", content: "Detect SQL injection points and report vulnerabilities." },
      { title: "XSS Scans", content: "Identify cross-site scripting issues in your JS and forms." },
      { title: "API Security", content: "Test REST APIs for security misconfigurations and authentication flaws." },
      { title: "Security Headers", content: "Check for missing or misconfigured security headers." },
      { title: "Rate Limiting", content: "Verify protections against brute force and flooding attacks." }
    ]
  },
  {
    title: "For Banks",
    description: "Assess online banking platforms for vulnerabilities, authentication flaws, and transaction security.",
    link: "/banks",
    icon: "🏦",
    color: "text-green-500",
    viewText: "View Bank Scanner",
    sections: [
      { title: "Authentication", content: "Check login, 2FA, and session security." },
      { title: "Transaction Security", content: "Ensure transactions are encrypted and tamper-proof." },
      { title: "Sensitive Data Exposure", content: "Audit for PII or financial data leaks." },
      { title: "Fraud Detection", content: "Simulate attacks to test fraud detection mechanisms." },
      { title: "Compliance", content: "Check compliance with banking regulations (PCI DSS, GDPR)." }
    ]
  },
  {
    title: "For E-commerce",
    description: "Check e-commerce sites for payment security issues, XSS, CSRF, and sensitive data exposure.",
    link: "/ecommerce",
    icon: "🛒",
    color: "text-blue-500",
    viewText: "View E-commerce Scanner",
    sections: [
      { title: "Payment Gateway", content: "Test secure payment flow and fraud detection." },
      { title: "CSRF/XSS", content: "Scan for cross-site scripting and CSRF vulnerabilities." },
      { title: "Data Leakage", content: "Ensure sensitive user data is stored and transmitted safely." },
      { title: "Inventory Security", content: "Check access control for product and order management." },
      { title: "User Account Protection", content: "Ensure proper password policies and session security." }
    ]
  }
];

const ScannersPage = () => {
  const [activeScanner, setActiveScanner] = useState(null);
  const navigate = useNavigate();

  // Scroll to the corresponding detail section
  const scrollToDetail = (index) => {
    setActiveScanner(index);
    const el = document.getElementById(`scanner-detail-${index}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Navigate to the actual scanner page
  const openScannerPage = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Header */}
      <div className="mt-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          A Comprehensive Set of Vulnerability Scans
        </h1>
        <p className="text-gray-700 max-w-3xl mx-auto mt-6 mb-16 text-lg">
          HostedScan provides focused vulnerability scans for Web, Banking, and E-commerce platforms.
          Click "View Details" to scroll down to the detailed scanner information.
        </p>
      </div>

      {/* Scanner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4 md:px-8 lg:px-12 mb-16">
        {scanners.map((scanner, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl p-8 flex flex-col justify-between transition transform hover:-translate-y-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className={`text-4xl ${scanner.color}`}>{scanner.icon}</div>
              <h2 className="text-xl md:text-2xl font-bold">{scanner.title}</h2>
            </div>
            <p className="text-gray-600 mb-8">{scanner.description}</p>

            <div className="flex items-center space-x-4 mt-auto">
              <button
                onClick={() => scrollToDetail(index)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-sm md:text-base"
              >
                View Details
              </button>
              <button
                onClick={() => openScannerPage(scanner.link)}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm md:text-base"
              >
                Open {scanner.title.split(" ")[1]} Scanner
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scanner Detail Sections */}
      <div className="max-w-5xl mx-auto space-y-20 mb-20">
        {scanners.map((scanner, index) => (
          <div
            key={index}
            id={`scanner-detail-${index}`}
            className={`rounded-lg border shadow-lg bg-white p-10 transition-transform duration-500 ${
              activeScanner === index ? "scale-100 opacity-100" : "scale-95 opacity-50"
            }`}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className={`text-4xl ${scanner.color}`}>{scanner.icon}</div>
              <h3 className="text-2xl font-bold">{scanner.title} — Detailed Scanner Info</h3>
            </div>
            <p className="text-gray-700 mb-6">{scanner.description}</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              {scanner.sections.map((section, idx) => (
                <li key={idx}>
                  <strong>{section.title}:</strong> {section.content}
                </li>
              ))}
            </ul>
            <button
              onClick={() => openScannerPage(scanner.link)}
              className="inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Open {scanner.title.split(" ")[1]} Scanner
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScannersPage;
