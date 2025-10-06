// src/pages/Homepage.jsx
import React from "react";

const Homepage = () => {
  const reports = [
    {
      title: "Vulnerability Overview",
      img: "https://i.postimg.cc/tJK62Vrd/Generated-Image-October-04-2025-8-12-PM-3.png",
      link: "https://postimg.cc/Fkx1K1X1",
    },
    {
      title: "Attack Trends",
      img: "https://i.postimg.cc/2jYq3b7K/placeholder2.png",
      link: "#",
    },
    {
      title: "Security Metrics",
      img: "https://i.postimg.cc/3xvPZ2Cm/placeholder3.png",
      link: "#",
    },
  ];

  const guides = [
    {
      title: "Select Application",
      desc: "Choose the web app or system you want to scan from the dashboard.",
      icon: "Icon",
    },
    {
      title: "Run Scan",
      desc: "Start the scanning process safely with one click.",
      icon: "Icon",
    },
    {
      title: "Review Findings",
      desc: "Analyze vulnerabilities, misconfigurations, and alerts.",
      icon: "Icon",
    },
    {
      title: "Take Action",
      desc: "Apply fixes and track remediation over time.",
      icon: "Icon",
    },
  ];

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#1a0e0c", position: "relative" }}
    >
      {/* Animated background + floating hero */}
      <style>{`
        .cross-lines-bg {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
          background: repeating-linear-gradient(45deg, rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.05) 1px, transparent 1px, transparent 20px),
                      repeating-linear-gradient(-45deg, rgba(255, 0, 0, 0.03), rgba(255, 0, 0, 0.03) 1px, transparent 1px, transparent 20px);
          animation: moveLines 15s linear infinite;
        }
        @keyframes moveLines { 0% { background-position: 0 0, 0 0; } 50% { background-position: 100px 100px, -100px -100px; } 100% { background-position: 0 0, 0 0; } }

        .floating-hero { animation: floatHero 6s ease-in-out infinite; will-change: transform; }
        @keyframes floatHero { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }

        .text-white-all h1, .text-white-all h2, .text-white-all h3, .text-white-all p { color: #f8f1e4; }

        .primary-button {
          background-color: #f92d2d; color: #fff; padding: 16px 32px; font-weight: 600;
          border-radius: 12px; transition: all 0.3s ease; border: 2px solid #ffd700;
        }
        .primary-button:hover { background-color: #ffd700; color: #f92d2d; transform: translateY(-3px); }

        .news-scroll { display: flex; overflow-x: auto; gap: 16px; padding-bottom: 8px; }
        .news-scroll::-webkit-scrollbar { height: 6px; }
        .news-scroll::-webkit-scrollbar-thumb { background: rgba(255,215,0,0.3); border-radius: 3px; }

        .news-card, .guide-card { background-color: rgba(255,215,0,0.05); border-radius: 12px; transition: transform 0.3s; }
        .news-card:hover, .guide-card:hover { transform: scale(1.05); }

        @keyframes bounce-once { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-bounce-once { animation: bounce-once 0.8s ease forwards; }
      `}</style>

      <div className="cross-lines-bg"></div>

      <main className="flex-grow p-6 space-y-40 relative z-10 text-white-all">

        {/* Hero Section */}
      <section
  className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 mt-32 rounded-lg p-8"
  style={{ backgroundColor: "#4B2E2E" }} // Habeshawi dark brown
>
  {/* Left: Text content */}
  <div className="space-y-8">
    <h1 className="text-5xl font-extrabold text-[#F0E4D7]">
      Protect Your Web Applications
    </h1>
    <p className="text-lg leading-relaxed max-w-xl text-[#E6D7C1]">
      Scan your web apps for vulnerabilities before attackers do. Identify weak spots,
      misconfigurations, and potential exploits, and take action to secure your systems.
    </p>
    <button className="px-6 py-3 bg-[#A95A3C] hover:bg-[#C75C3D] text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105">
      🚀 Get Started
    </button>
  </div>

  {/* Right: Illustration */}
  <div className="flex justify-center relative">
    <img
      src="https://i.postimg.cc/ZnbXhMKB/Pokecut-1759577444370.png"
      alt="Dashboard Illustration"
      className="rounded-lg shadow-2xl w-full max-w-lg md:max-w-xl lg:max-w-2xl floating-hero transition-transform transform hover:scale-105 hover:rotate-1"
    />
    {/* Optional: subtle floating effect */}
    <style>{`
      .floating-hero {
        animation: float 4s ease-in-out infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
      }
    `}</style>
  </div>
</section>

        {/* Production-Grade Safety */}
        <section className="rounded-lg shadow-2xl p-8 bg-[#4B2E2E] text-white">
  <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#F0E4D7]">Production-Grade Safety</h2>
      <p className="text-[#E6D7C1] mt-1 max-w-xl">
        Safety-first scanning: production-safe checks, strict controls, and secure evidence handling
        so your ops remain stable and auditable.
      </p>
    </div>

    <div className="mt-4 md:mt-0 flex items-center gap-3">
      <span className="px-3 py-1 text-xs bg-green-700 rounded-full font-medium text-white">Production-safe</span>
      <span className="px-3 py-1 text-xs bg-[#593127] rounded-full text-[#E6D7C1]">Audit-ready</span>
    </div>
  </header>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Left: feature list */}
    <div className="space-y-4">
      {/* item */}
      <div className="flex gap-4 items-start bg-[#5C3B2E] p-4 rounded-lg border border-transparent hover:border-[#A95A3C] transition">
        <div className="flex-none w-10 h-10 bg-[#3E1F1F] rounded-full flex items-center justify-center">
          {/* Shield */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#F0E4D7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v5.5c0 5-3 9-9 9s-9-4-9-9V6.5L12 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-[#F0E4D7]">Safe Heuristics</h4>
            <span className="text-xs text-[#E6D7C1]">Designed for production</span>
          </div>
          <p className="text-[#E6D7C1] text-sm mt-1">Checks tuned to avoid service disruption and false positives — safe defaults only.</p>
        </div>
      </div>

      <div className="flex gap-4 items-start bg-[#5C3B2E] p-4 rounded-lg border border-transparent hover:border-[#A95A3C] transition">
        <div className="flex-none w-10 h-10 bg-[#4B2E2E] rounded-full flex items-center justify-center">
          {/* Rate limit */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#F0E4D7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-[#F0E4D7]">Rate Limiting</h4>
            <span className="text-xs text-[#E6D7C1]">Prevent overload</span>
          </div>
          <p className="text-[#E6D7C1] text-sm mt-1">Configurable limits per target, concurrency controls, and backoff strategies.</p>
        </div>
      </div>

      <div className="flex gap-4 items-start bg-[#5C3B2E] p-4 rounded-lg border border-transparent hover:border-[#A95A3C] transition">
        <div className="flex-none w-10 h-10 bg-[#3B2A2A] rounded-full flex items-center justify-center">
          {/* Audit */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#F0E4D7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-[#F0E4D7]">Audit Logging</h4>
            <span className="text-xs text-[#E6D7C1]">Immutable activity trail</span>
          </div>
          <p className="text-[#E6D7C1] text-sm mt-1">Full evidence of scan actions, who approved them, and timestamps for compliance audits.</p>
        </div>
      </div>

      {/* Repeat the same style for the remaining features */}
    </div>

    {/* Right: Advanced tool integration panel */}
    <div className="bg-[#593127] p-5 rounded-lg border border-[#4B2E2E]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[#F0E4D7]">Advanced Tool Integration</h3>
          <p className="text-[#E6D7C1] text-sm mt-1">Controlled access to advanced testers and secure evidence handling workflows.</p>
        </div>
        <div className="text-xs text-[#CFC3B0]">v1.2</div>
      </div>

      <div className="mt-4 space-y-3">
        {/* Each details panel */}
        <details className="bg-[#4B2E2E] p-3 rounded-md open:ring-2 open:ring-[#A95A3C]">
          <summary className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#3B2A2A] rounded-full flex items-center justify-center">
                {/* Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#F0E4D7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4 6v6c0 5 3 9 8 9s8-4 8-9V6l-8-4z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-[#F0E4D7]">SQLMap Integration</div>
                <div className="text-xs text-[#CFC3B0]">Production-safe automated SQL testing</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-1 bg-transparent border border-[#4B2E2E] text-xs rounded-md text-[#E6D7C1] hover:bg-[#A95A3C]">Docs</button>
              <span className="px-2 py-0.5 bg-[#A95A3C] rounded-full text-xs text-black font-medium">Requires Approval</span>
            </div>
          </summary>

          <div className="mt-3 text-sm text-[#E6D7C1]">
            Runs in isolated jump-hosts with sanitized outputs. All runs require explicit human approval; results are stored encrypted and redacted for PII.
          </div>
        </details>

        {/* Repeat for the remaining details */}
      </div>
    </div>
  </div>

  <footer className="mt-6 text-sm text-[#CFC3B0]">
    <div>Recommended: schedule advanced tool runs during approved maintenance windows and require 2-step human approval for any automated exploit checks.</div>
  </footer>
</section>

       <section className="rounded-lg shadow-xl p-8 bg-[#4B2E2E] text-white">
  <h2 className="text-3xl font-bold mb-6 text-center text-[#F0E4D7]">Security News & Alerts</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border-collapse">
      <thead className="bg-[#6B3A2A]">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Severity</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#5A2D1D]">
        <tr className="hover:bg-[#593127] transition-colors">
          <td className="px-6 py-4">
            {/* Shield icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v5.5c0 5-3 9-9 9s-9-4-9-9V6.5L12 2z" />
            </svg>
          </td>
          <td className="px-6 py-4 font-medium text-[#F0E4D7]">Critical Cisco Firewall Vulnerabilities Discovered</td>
          <td className="px-6 py-4">
            <span className="px-2 py-1 bg-red-700 text-white text-xs rounded-full">Critical</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#E6D7C1]">Oct 3, 2025</td>
          <td className="px-6 py-4">
            <a href="https://www.techradar.com/pro/security/around-50-000-cisco-firewalls-are-vulnerable-to-attack-so-patch-now" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-[#A95A3C] hover:bg-[#B66A4C] rounded-md text-white text-sm transition">
              View Article
            </a>
          </td>
        </tr>

        <tr className="hover:bg-[#593127] transition-colors">
          <td className="px-6 py-4">
            {/* Network icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3m0 0a3 3 0 106 0m0 0h3m-6 0V6m0 12v-6" />
            </svg>
          </td>
          <td className="px-6 py-4 font-medium text-[#F0E4D7]">Kido Nursery Data Breach: 8,000 Children's Data Stolen</td>
          <td className="px-6 py-4">
            <span className="px-2 py-1 bg-orange-700 text-white text-xs rounded-full">High</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#E6D7C1]">Oct 2, 2025</td>
          <td className="px-6 py-4">
            <a href="https://www.theguardian.com/technology/2025/oct/02/kido-nursery-hackers-say-they-have-deleted-stolen-data" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-[#A95A3C] hover:bg-[#B66A4C] rounded-md text-white text-sm transition">
              View Article
            </a>
          </td>
        </tr>

        <tr className="hover:bg-[#593127] transition-colors">
          <td className="px-6 py-4">
            {/* Warning icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M2.458 12l8.042-8.042a1.5 1.5 0 012.122 0L21.542 12a1.5 1.5 0 010 2.122L12.622 22.164a1.5 1.5 0 01-2.122 0L2.458 14.122a1.5 1.5 0 010-2.122z" />
            </svg>
          </td>
          <td className="px-6 py-4 font-medium text-[#F0E4D7]">China-Linked Group Deploys New Malware</td>
          <td className="px-6 py-4">
            <span className="px-2 py-1 bg-yellow-700 text-white text-xs rounded-full">Medium</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#E6D7C1]">Oct 1, 2025</td>
          <td className="px-6 py-4">
            <a href="https://thehackernews.com/2025/09/phantom-taurus-new-china-linked-hacker.html" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-[#A95A3C] hover:bg-[#B66A4C] rounded-md text-white text-sm transition">
              View Article
            </a>
          </td>
        </tr>

        <tr className="hover:bg-[#593127] transition-colors">
          <td className="px-6 py-4">
            {/* Robot/AI icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v4m0 0v2m0-2h2m-2 0H10m4-10a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </td>
          <td className="px-6 py-4 font-medium text-[#F0E4D7]">AI Security Threats Escalate Amidst Budget Cuts</td>
          <td className="px-6 py-4">
            <span className="px-2 py-1 bg-yellow-700 text-white text-xs rounded-full">Medium</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#E6D7C1]">Oct 1, 2025</td>
          <td className="px-6 py-4">
            <a href="https://www.rbcwealthmanagement.com/en-asia/insights/ais-big-leaps-in-2025" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-[#A95A3C] hover:bg-[#B66A4C] rounded-md text-white text-sm transition">
              View Article
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div className="mt-6 bg-[#5C3B2E] p-4 rounded-lg text-center shadow-inner">
    <p className="text-[#E6D7C1]">
      Staying updated on security threats protects your data, systems, and business reputation. Always monitor alerts and act promptly.
    </p>
  </div>
</section>



        {/* User Guide / How to Scan */}
               
<section className="relative rounded-lg p-12 bg-[#4B2E2A] text-white overflow-hidden">
  {/* Animated cross lines background */}
  <div className="absolute inset-0 z-0 cross-lines-bg"></div>

  {/* Inline styles for animations */}
  <style>{`
    .cross-lines-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background: repeating-linear-gradient(
          45deg,
          rgba(255, 215, 0, 0.05),
          rgba(255, 215, 0, 0.05) 1px,
          transparent 1px,
          transparent 20px
        ),
        repeating-linear-gradient(
          -45deg,
          rgba(255, 215, 0, 0.03),
          rgba(255, 215, 0, 0.03) 1px,
          transparent 1px,
          transparent 20px
        );
      animation: moveLines 20s linear infinite;
    }

    @keyframes moveLines {
      0% { background-position: 0 0, 0 0; }
      50% { background-position: 100px 100px, -100px -100px; }
      100% { background-position: 0 0, 0 0; }
    }

    /* Floating animation for cards */
    .floating-card {
      animation: floatCard 6s ease-in-out infinite;
    }

    @keyframes floatCard {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `}</style>

  <h2 className="text-3xl font-bold mb-10 text-center relative z-10">User Guide / How to Scan</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
    
    {/* Card 1 */}
    <div className="floating-card bg-[#6B422F] p-6 rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-transform transition-shadow duration-300 ease-in-out">
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[#A66E4F] rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17h4.5M4.5 4.5h15v12h-15v-12z" />
        </svg>
      </div>
      <h3 className="font-semibold text-lg mb-2">Select Application</h3>
      <p className="text-sm">Choose the web app or system you want to scan from the dashboard.</p>
    </div>

    {/* Card 2 */}
    <div className="floating-card bg-[#6B422F] p-6 rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-transform transition-shadow duration-300 ease-in-out">
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[#9C5C3C] rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="font-semibold text-lg mb-2">Start Scan</h3>
      <p className="text-sm">Click the “Start Scan” button to begin automated vulnerability scanning.</p>
    </div>

    {/* Card 3 */}
    <div className="floating-card bg-[#6B422F] p-6 rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-transform transition-shadow duration-300 ease-in-out">
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[#8C5C3A] rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M18 9l-6 6-3-3-4 4" />
        </svg>
      </div>
      <h3 className="font-semibold text-lg mb-2">View Results</h3>
      <p className="text-sm">Check detailed scan reports showing vulnerabilities, risk levels, and remediation steps.</p>
    </div>

    {/* Card 4 */}
    <div className="floating-card bg-[#6B422F] p-6 rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-transform transition-shadow duration-300 ease-in-out">
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[#B48C55] rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V7a4 4 0 00-8 0v4M6 11h12v10H6V11z" />
        </svg>
      </div>
      <h3 className="font-semibold text-lg mb-2">Secure Your App</h3>
      <p className="text-sm">Follow recommendations to patch vulnerabilities and improve your application security.</p>
    </div>

  </div>
</section>





      </main>

      {/* Footer */}
      <footer className="bg-[#2b150f] text-white py-8 mt-16 relative z-10 border-t-4 border-[#f92d2d]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-2xl font-bold">Gasha</div>
          <div className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Gasha. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
