import React from "react";
import { useNavigate } from "react-router-dom";

const scanners = [
  {
    title: "Web Applications",
    description: `Secure your websites and APIs with precision. HostedScan identifies SQL Injection, XSS, CSRF, and misconfigurations. Keep attackers out and systems resilient.`,
    link: "/webapps",
    icon: "🌐",
    color: "from-yellow-500 to-amber-600 text-white",
  },
  {
    title: "Banks",
    description: `Strengthen online banking security. HostedScan checks authentication, transactions, fraud detection, and compliance to protect sensitive financial data.`,
    link: "/banks",
    icon: "🏦",
    color: "from-green-600 to-green-700 text-white",
  },
  {
    title: "E-commerce",
    description: `Keep your online store safe. HostedScan scans payment gateways, CSRF/XSS vulnerabilities, and sensitive data exposure for smooth, secure business operations.`,
    link: "/ecommerce",
    icon: "🛒",
    color: "from-red-500 to-pink-600 text-white",
  },
];

const ScannersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 bg-[#fdf5e6] overflow-hidden space-y-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern
              id="habeshaPattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 0 L40 0 L0 40 Z"
                stroke="#D9B382"
                strokeWidth="1"
                fill="transparent"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#habeshaPattern)" />
        </svg>
      </div>

      {/* Page Header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-[#8B5E3C]">
          ጋሻ Scanners
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto mt-4 text-base md:text-lg leading-relaxed">
          HostedScan provides specialized scanners for Web Applications, Banking platforms, and E-commerce websites. Explore each scanner and quickly access detailed tools for ultimate protection.
        </p>
      </div>

      {/* Scanner Sections */}
      {scanners.map((scanner, index) => {
        const isEven = index % 2 === 0;
        return (
          <div
            key={index}
            className={`relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16 bg-white rounded-xl shadow-lg p-10 border-l-4 border-[#8B5E3C]`}
          >
            {/* Left: Description */}
            <div
              className={`md:w-1/2 space-y-4 ${
                isEven ? "order-1" : "order-2 md:order-1 md:pl-6"
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#5C3A21]">
                {scanner.title}
              </h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {scanner.description}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:flex w-1 h-64 bg-[#D9B382] rounded-full mx-6"></div>

            {/* Right: Action Card */}
            <div
              className={`md:w-1/2 flex flex-col items-center justify-center space-y-6 ${
                isEven ? "order-2" : "order-1 md:order-2 md:pr-6"
              }`}
            >
              <div
                className={`flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br ${scanner.color} text-6xl shadow-lg`}
              >
                {scanner.icon}
              </div>
              <button
                onClick={() => navigate(scanner.link)}
                className="px-8 py-4 bg-[#8B5E3C] text-white rounded-md font-semibold hover:bg-[#B58B5E] shadow-md transition duration-300 transform hover:scale-105"
              >
                Open {scanner.title} Scanner
              </button>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <footer className="bg-[#2b150f] text-white py-4 mt-16 relative z-10 text-center text-sm">
        &copy; {new Date().getFullYear()} ጋሻ. All rights reserved.
      </footer>
    </div>
  );
};

export default ScannersPage;
