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
{/* what we do */}


        <section className="rounded-lg shadow-2xl p-8 bg-[#07121b] text-white">
  <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl font-extrabold">Production-Grade Safety</h2>
      <p className="text-gray-300 mt-1 max-w-xl">
        Safety-first scanning: production-safe checks, strict controls, and secure evidence handling
        so your ops remain stable and auditable.
      </p>
    </div>

    <div className="mt-4 md:mt-0 flex items-center gap-3">
      <span className="px-3 py-1 text-xs bg-green-600 rounded-full font-medium">Production-safe</span>
      <span className="px-3 py-1 text-xs bg-slate-700 rounded-full text-gray-200">Audit-ready</span>
    </div>
  </header>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Left: feature list */}
    <div className="space-y-4">
      {/* item */}
      <div className="flex gap-4 items-start bg-[#0d1a26] p-4 rounded-lg border border-transparent hover:border-slate-700 transition">
        <div className="flex-none w-10 h-10 bg-[#09263a] rounded-full flex items-center justify-center">
          {/* Shield */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v5.5c0 5-3 9-9 9s-9-4-9-9V6.5L12 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Safe Heuristics</h4>
            <span className="text-xs text-gray-300">Designed for production</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">Checks tuned to avoid service disruption and false positives — safe defaults only.</p>
        </div>
      </div>

      <div className="flex gap-4 items-start bg-[#0d1a26] p-4 rounded-lg border border-transparent hover:border-slate-700 transition">
        <div className="flex-none w-10 h-10 bg-[#2a1a0f] rounded-full flex items-center justify-center">
          {/* Rate limit */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Rate Limiting</h4>
            <span className="text-xs text-gray-300">Prevent overload</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">Configurable limits per target, concurrency controls, and backoff strategies.</p>
        </div>
      </div>

      <div className="flex gap-4 items-start bg-[#0d1a26] p-4 rounded-lg border border-transparent hover:border-slate-700 transition">
        <div className="flex-none w-10 h-10 bg-[#1a1732] rounded-full flex items-center justify-center">
          {/* Audit */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Audit Logging</h4>
            <span className="text-xs text-gray-300">Immutable activity trail</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">Full evidence of scan actions, who approved them, and timestamps for compliance audits.</p>
        </div>
      </div>

      <div className="flex gap-4 items-start bg-[#0d1a26] p-4 rounded-lg border border-transparent hover:border-slate-700 transition">
        <div className="flex-none w-10 h-10 bg-[#11221a] rounded-full flex items-center justify-center">
          {/* Allowlist */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Target Allowlisting</h4>
            <span className="text-xs text-gray-300">Validated targets only</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">Mandatory validation and owner approval so only authorized targets are scanned.</p>
        </div>
      </div>

      <div className="flex gap-4 items-start bg-[#0d1a26] p-4 rounded-lg border border-transparent hover:border-slate-700 transition">
        <div className="flex-none w-10 h-10 bg-[#1a1222] rounded-full flex items-center justify-center">
          {/* Time window */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-pink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Time Windows</h4>
            <span className="text-xs text-gray-300">Scheduled scanning</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">Run scans in pre-approved maintenance windows to avoid peak hours and service impact.</p>
        </div>
      </div>
    </div>

    {/* Right: Advanced tool integration panel */}
    <div className="bg-[#071a26] p-5 rounded-lg border border-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">Advanced Tool Integration</h3>
          <p className="text-gray-300 text-sm mt-1">Controlled access to advanced testers and secure evidence handling workflows.</p>
        </div>
        <div className="text-xs text-gray-400">v1.2</div>
      </div>

      <div className="mt-4 space-y-3">
        <details className="bg-[#0b2230] p-3 rounded-md open:ring-2 open:ring-slate-700">
          <summary className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#132135] rounded-full flex items-center justify-center">
                {/* SQL icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4 6v6c0 5 3 9 8 9s8-4 8-9V6l-8-4z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">SQLMap Integration</div>
                <div className="text-xs text-gray-400">Production-safe automated SQL testing</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-1 bg-transparent border border-slate-700 text-xs rounded-md text-gray-300 hover:bg-slate-700">Docs</button>
              <span className="px-2 py-0.5 bg-amber-500 rounded-full text-xs text-black font-medium">Requires Approval</span>
            </div>
          </summary>

          <div className="mt-3 text-sm text-gray-300">
            Runs in isolated jump-hosts with sanitized outputs. All runs require explicit human approval; results are stored encrypted and redacted for PII.
          </div>
        </details>

        <details className="bg-[#0b2230] p-3 rounded-md open:ring-2 open:ring-slate-700">
          <summary className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#132135] rounded-full flex items-center justify-center">
                {/* Human approval */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a5 5 0 100-10 5 5 0 000 10z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Human Approval Workflow</div>
                <div className="text-xs text-gray-400">Mandatory authorization for advanced tools</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-1 bg-transparent border border-slate-700 text-xs rounded-md text-gray-300 hover:bg-slate-700">View Queue</button>
              <span className="px-2 py-0.5 bg-sky-500 rounded-full text-xs text-black font-medium">Gate</span>
            </div>
          </summary>

          <div className="mt-3 text-sm text-gray-300">
            Approval records include approver ID, reason, and time-window; approvals are logged and cannot be bypassed.
          </div>
        </details>

        <details className="bg-[#0b2230] p-3 rounded-md open:ring-2 open:ring-slate-700">
          <summary className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#132135] rounded-full flex items-center justify-center">
                {/* Isolation */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Isolated Execution</div>
                <div className="text-xs text-gray-400">Jump host execution for sensitive operations</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-1 bg-transparent border border-slate-700 text-xs rounded-md text-gray-300 hover:bg-slate-700">Manage Hosts</button>
              <span className="px-2 py-0.5 bg-emerald-500 rounded-full text-xs text-black font-medium">Isolated</span>
            </div>
          </summary>

          <div className="mt-3 text-sm text-gray-300">
            Jump-hosts are ephemeral, audited, and network-restricted. Evidence is collected off-host and sanitized before storage.
          </div>
        </details>

        <details className="bg-[#0b2230] p-3 rounded-md open:ring-2 open:ring-slate-700">
          <summary className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#132135] rounded-full flex items-center justify-center">
                {/* Evidence */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Evidence Handling</div>
                <div className="text-xs text-gray-400">Secure collection and sanitization</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-1 bg-transparent border border-slate-700 text-xs rounded-md text-gray-300 hover:bg-slate-700">Policy</button>
              <span className="px-2 py-0.5 bg-rose-500 rounded-full text-xs text-black font-medium">PII-safe</span>
            </div>
          </summary>

          <div className="mt-3 text-sm text-gray-300">
            Evidence is automatically redacted, hashed, and stored encrypted with access controls for auditors only.
          </div>
        </details>
      </div>
    </div>
  </div>

  <footer className="mt-6 text-sm text-gray-400">
    <div>Recommended: schedule advanced tool runs during approved maintenance windows and require 2-step human approval for any automated exploit checks.</div>
  </footer>
</section>


        {/* Vulnerabilities Section */}
      <section className="rounded-lg shadow-2xl p-8 bg-gradient-to-b from-[#081220] to-[#0b1f30] text-white mt-8">
  {/* Section Header */}
  <header className="mb-6 text-center">
    <h2 className="text-3xl font-extrabold">Security Analytics / Reports</h2>
    <p className="text-gray-300 mt-1 max-w-xl mx-auto">
      Placeholder section for charts or images. Click images to view full resolution.
    </p>
  </header>

  {/* Cards Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Card 1 */}
    <div
      className="bg-[#0c1f30] rounded-xl p-6 flex flex-col items-center justify-center shadow animate-bounce-once delay-[200ms]"
    >
      <div className="w-full h-48 rounded-lg overflow-hidden flex items-center justify-center">
        <a href="https://postimg.cc/Fkx1K1X1" target="_blank" rel="noopener noreferrer">
          <img
            src="https://i.postimg.cc/tJK62Vrd/Generated-Image-October-04-2025-8-12-PM-3.png"
            alt="Vulnerability Overview"
            className="w-full h-full object-cover rounded-lg"
          />
        </a>
      </div>
      <h3 className="font-semibold text-lg mt-4">Vulnerability Overview</h3>
      <p className="text-gray-400 text-sm mt-1 text-center">
        Click the image to view full resolution.
      </p>
    </div>

    {/* Card 2 */}
    <div
      className="bg-[#0c1f30] rounded-xl p-6 flex flex-col items-center justify-center shadow animate-bounce-once delay-[600ms]"
    >
      <div className="w-full h-48 rounded-lg overflow-hidden flex items-center justify-center">
        <a href="https://postimg.cc/9DwqjdFg" target="_blank" rel="noopener noreferrer">
          <img
            src="https://i.postimg.cc/g2Ny849p/Generated-Image-October-04-2025-8-12-PM-1.png"
            alt="Department Scans"
            className="w-full h-full object-cover rounded-lg"
          />
        </a>
      </div>
      <h3 className="font-semibold text-lg mt-4">Department Scans</h3>
      <p className="text-gray-400 text-sm mt-1 text-center">
        Click the image to view full resolution.
      </p>
    </div>

    {/* Card 3 */}
    <div
      className="bg-[#0c1f30] rounded-xl p-6 flex flex-col items-center justify-center shadow animate-bounce-once delay-[1000ms]"
    >
      <div className="w-full h-48 rounded-lg overflow-hidden flex items-center justify-center">
        <a href="https://postimg.cc/SXyqG453" target="_blank" rel="noopener noreferrer">
          <img
            src="https://i.postimg.cc/fbdLDTvz/Generated-Image-October-04-2025-8-12-PM.png"
            alt="Monthly Threat Trends"
            className="w-full h-full object-cover rounded-lg"
          />
        </a>
      </div>
      <h3 className="font-semibold text-lg mt-4">Monthly Threat Trends</h3>
      <p className="text-gray-400 text-sm mt-1 text-center">
        Click the image to view full resolution.
      </p>
    </div>
  </div>
</section>

<style>
{`
  @keyframes bounce-once {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  .animate-bounce-once {
    animation: bounce-once 0.8s ease forwards;
  }
  .delay-[200ms] { animation-delay: 0.2s; }
  .delay-[600ms] { animation-delay: 0.6s; }
  .delay-[1000ms] { animation-delay: 1s; }
`}
</style>







        {/* Security News / Alerts */}
<section className="rounded-lg shadow-xl p-8 bg-[#0b1320] text-white">
  <h2 className="text-3xl font-bold mb-6 text-center">Security News & Alerts</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border-collapse">
      <thead className="bg-[#1f2a3a]">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Severity</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#2a3a4a]">
        <tr className="hover:bg-[#1c2533] transition-colors">
          <td className="px-6 py-4">
            {/* Shield icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v5.5c0 5-3 9-9 9s-9-4-9-9V6.5L12 2z" />
            </svg>
          </td>
          <td className="px-6 py-4 font-medium">Critical Cisco Firewall Vulnerabilities Discovered</td>
          <td className="px-6 py-4">
            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">Critical</span>
          </td>
          <td className="px-6 py-4 text-sm text-gray-300">Oct 3, 2025</td>
          <td className="px-6 py-4">
            <a href="https://www.techradar.com/pro/security/around-50-000-cisco-firewalls-are-vulnerable-to-attack-so-patch-now" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm transition">
              View Article
            </a>
          </td>
        </tr>

        <tr className="hover:bg-[#1c2533] transition-colors">
          <td className="px-6 py-4">
            {/* Network icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3m0 0a3 3 0 106 0m0 0h3m-6 0V6m0 12v-6" />
            </svg>
          </td>
          <td className="px-6 py-4 font-medium">Kido Nursery Data Breach: 8,000 Children's Data Stolen</td>
          <td className="px-6 py-4">
            <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">High</span>
          </td>
          <td className="px-6 py-4 text-sm text-gray-300">Oct 2, 2025</td>
          <td className="px-6 py-4">
            <a href="https://www.theguardian.com/technology/2025/oct/02/kido-nursery-hackers-say-they-have-deleted-stolen-data" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm transition">
              View Article
            </a>
          </td>
        </tr>

        <tr className="hover:bg-[#1c2533] transition-colors">
          <td className="px-6 py-4">
            {/* Warning icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M2.458 12l8.042-8.042a1.5 1.5 0 012.122 0L21.542 12a1.5 1.5 0 010 2.122L12.622 22.164a1.5 1.5 0 01-2.122 0L2.458 14.122a1.5 1.5 0 010-2.122z" />
            </svg>
          </td>
          <td className="px-6 py-4 font-medium">China-Linked Group Deploys New Malware</td>
          <td className="px-6 py-4">
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Medium</span>
          </td>
          <td className="px-6 py-4 text-sm text-gray-300">Oct 1, 2025</td>
          <td className="px-6 py-4">
            <a href="https://thehackernews.com/2025/09/phantom-taurus-new-china-linked-hacker.html" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm transition">
              View Article
            </a>
          </td>
        </tr>

        <tr className="hover:bg-[#1c2533] transition-colors">
          <td className="px-6 py-4">
            {/* Robot/AI icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v4m0 0v2m0-2h2m-2 0H10m4-10a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </td>
          <td className="px-6 py-4 font-medium">AI Security Threats Escalate Amidst Budget Cuts</td>
          <td className="px-6 py-4">
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Medium</span>
          </td>
          <td className="px-6 py-4 text-sm text-gray-300">Oct 1, 2025</td>
          <td className="px-6 py-4">
            <a href="https://www.rbcwealthmanagement.com/en-asia/insights/ais-big-leaps-in-2025" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm transition">
              View Article
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div className="mt-6 bg-[#111a2b] p-4 rounded-lg text-center shadow-inner">
    <p className="text-gray-300">
      Staying updated on security threats protects your data, systems, and business reputation. Always monitor alerts and act promptly.
    </p>
  </div>
</section>





        {/* User Guide / How to Scan */}
       
<section className="rounded-lg shadow-xl p-12 bg-[#081220] text-white">
  <h2 className="text-3xl font-bold mb-10 text-center">User Guide / How to Scan</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    
    {/* Card 1 */}
    <div className="bg-[#0f1b2a] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-blue-500 rounded-full">
        {/* Desktop icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17h4.5M4.5 4.5h15v12h-15v-12z" />
        </svg>
      </div>
      <h3 className="font-semibold text-lg mb-2">Select Application</h3>
      <p className="text-gray-300 text-sm">Choose the web app or system you want to scan from the dashboard.</p>
    </div>

    {/* Card 2 */}
    <div className="bg-[#0f1b2a] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-yellow-500 rounded-full">
        {/* Lightning icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="font-semibold text-lg mb-2">Start Scan</h3>
      <p className="text-gray-300 text-sm">Click the “Start Scan” button to begin automated vulnerability scanning.</p>
    </div>

    {/* Card 3 */}
    <div className="bg-[#0f1b2a] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-green-500 rounded-full">
        {/* Chart icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M18 9l-6 6-3-3-4 4" />
        </svg>
      </div>
      <h3 className="font-semibold text-lg mb-2">View Results</h3>
      <p className="text-gray-300 text-sm">Check detailed scan reports showing vulnerabilities, risk levels, and remediation steps.</p>
    </div>

    {/* Card 4 */}
    <div className="bg-[#0f1b2a] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-red-500 rounded-full">
        {/* Lock icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V7a4 4 0 00-8 0v4M6 11h12v10H6V11z" />
        </svg>
      </div>
      <h3 className="font-semibold text-lg mb-2">Secure Your App</h3>
      <p className="text-gray-300 text-sm">Follow recommendations to patch vulnerabilities and improve your application security.</p>
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
