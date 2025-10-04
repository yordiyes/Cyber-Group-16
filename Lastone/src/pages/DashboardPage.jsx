// src/pages/DashboardPage.jsx
import React from "react";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#081220ff", position: "relative" }}
    >

      {/* Inline CSS for animated background and floating hero */}
      <style>{`
        /* Cross lines moving background */
        .cross-lines-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.05),
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px,
              transparent 20px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.05),
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px,
              transparent 20px
            );
          animation: moveLines 15s linear infinite;
        }

        @keyframes moveLines {
          0% { background-position: 0 0, 0 0; }
          50% { background-position: 100px 100px, -100px -100px; }
          100% { background-position: 0 0, 0 0; }
        }

        /* Floating Hero Image */
        .floating-hero {
          animation: floatHero 6s ease-in-out infinite;
        }

        @keyframes floatHero {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        /* All text white */
        .text-white-all h1,
        .text-white-all h2,
        .text-white-all h3,
        .text-white-all p {
          color: #ffffff;
        }

        /* Horizontal scroll for news cards */
        .news-scroll {
          display: flex;
          overflow-x: auto;
          gap: 16px;
          padding-bottom: 8px;
        }
        .news-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .news-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
        }
        .news-card {
          min-width: 250px;
          background-color: rgba(255,255,255,0.05);
          padding: 16px;
          border-radius: 12px;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .news-card:hover {
          transform: scale(1.05);
        }

        /* User Guide Step Cards */
        .guide-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }
        .guide-card {
          flex: 1 1 220px;
          background-color: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          transition: transform 0.3s;
        }
        .guide-card:hover {
          transform: translateY(-10px);
        }
        .guide-icon {
          font-size: 36px;
          margin-bottom: 12px;
        }
      `}</style>

      {/* Animated cross lines background */}
      <div className="cross-lines-bg"></div>

      <Navbar />

      {/* Main content */}
      <main className="flex-grow p-6 space-y-40 relative z-10 text-white-all">

        {/* Hero Section */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 mt-32 rounded-lg p-8"
          style={{ backgroundColor: "#081220ff" }}
        >
          <div className="space-y-8">
            <h1 className="text-5xl font-bold">
              Protect Your Web Applications
            </h1>
            <p className="text-lg leading-relaxed max-w-xl">
              Scan your web apps for vulnerabilities before attackers do.  
              Identify weak spots, misconfigurations, and potential exploits, and take action to secure your systems.
            </p>
            <button className="bg-blue-600 text-white px-10 py-5 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition">
              🚀 Get Started
            </button>
          </div>

          <div className="flex justify-center">
            <img
              src="https://i.postimg.cc/ZnbXhMKB/Pokecut-1759577444370.png"
              alt="Dashboard Illustration"
              className="rounded-lg shadow-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl floating-hero"
            />
          </div>
        </section>

        {/* What We Do Section */}
        <section
          className="rounded-lg shadow-lg p-16 text-center"
          style={{ backgroundColor: "#081220ff" }}
        >
          <h2 className="text-3xl font-bold mb-8">What We Do</h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-10">
            We scan your applications thoroughly to identify vulnerabilities and misconfigurations.  
            You can view exactly what was scanned and track the results in real-time.
          </p>
          <img
            src="https://via.placeholder.com/800x400.png?text=Scan+Screenshot"
            alt="Scan Screenshot"
            className="rounded-lg shadow-lg mb-8 mx-auto"
          />
          <div className="bg-white bg-opacity-10 shadow rounded-lg p-10 h-64 flex items-center justify-center mx-auto">
            <p>Chart Placeholder</p>
          </div>
        </section>

        {/* Vulnerabilities Section */}
        <section
          className="rounded-lg shadow-lg p-16 text-center"
          style={{ backgroundColor: "#081220ff" }}
        >
          <h2 className="text-3xl font-bold mb-12">Common Vulnerabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-4">SQL Injection</h3>
              <p>Attackers can manipulate database queries to access unauthorized data.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-4">Cross-Site Scripting (XSS)</h3>
              <p>Inject malicious scripts into webpages viewed by other users.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-4">Broken Authentication</h3>
              <p>Weak authentication mechanisms allow attackers to compromise accounts.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-4">Sensitive Data Exposure</h3>
              <p>Improperly protected data can be stolen or leaked by attackers.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-4">Security Misconfiguration</h3>
              <p>Incorrectly configured servers or applications can be exploited.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-4">Cross-Site Request Forgery (CSRF)</h3>
              <p>Tricks authenticated users into performing unwanted actions on websites.</p>
            </div>
          </div>
        </section>

        {/* Security News / Alerts */}
       <section
          className="rounded-lg shadow-lg p-16"
          style={{ backgroundColor: "#081220ff" }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Security News & Alerts</h2>
          <div className="news-scroll">
            <div className="news-card">
              <h3 className="font-bold mb-2">New Ransomware Alert</h3>
              <p>Ransomware attacks targeting small businesses are increasing. Update your backups!</p>
            </div>
            <div className="news-card">
              <h3 className="font-bold mb-2">Critical SQL Injection Found</h3>
              <p>A new SQL injection vulnerability affects popular CMS platforms. Patch immediately.</p>
            </div>
            <div className="news-card">
              <h3 className="font-bold mb-2">Zero-Day Vulnerability</h3>
              <p>A zero-day exploit in web browsers has been reported. Avoid suspicious sites.</p>
            </div>
            <div className="news-card">
              <h3 className="font-bold mb-2">New Phishing Attack Trend</h3>
              <p>Phishing emails are increasingly targeting developers and IT admins. Stay alert.</p>
            </div>
          </div>
        </section>

        {/* User Guide / How to Scan */}
        <section
          className="rounded-lg shadow-lg p-16"
          style={{ backgroundColor: "#081220ff" }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">User Guide / How to Scan</h2>
          <div className="guide-cards">
            <div className="guide-card">
              <div className="guide-icon">🖥️</div>
              <h3 className="font-bold mb-2">Select Application</h3>
              <p>Choose the web app or system you want to scan from the dashboard.</p>
            </div>
            <div className="guide-card">
              <div className="guide-icon">⚡</div>
              <h3 className="font-bold mb-2">Start Scan</h3>
              <p>Click the “Start Scan” button to begin automated vulnerability scanning.</p>
            </div>
            <div className="guide-card">
              <div className="guide-icon">📊</div>
              <h3 className="font-bold mb-2">View Results</h3>
              <p>Check detailed scan reports showing vulnerabilities, risk levels, and remediation steps.</p>
            </div>
            <div className="guide-card">
              <div className="guide-icon">🔒</div>
              <h3 className="font-bold mb-2">Secure Your App</h3>
              <p>Follow recommendations to patch vulnerabilities and improve your application security.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-2xl font-bold">VulnScanner</div>
          <div className="flex space-x-6"></div>
          <div className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} VulnScanner. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
};

export default DashboardPage;
