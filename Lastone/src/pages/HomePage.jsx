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
      style={{ backgroundColor: "#6F4E37", position: "relative" }}
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
  style={{ backgroundColor: "#6F4E37" }} // Habeshawi dark brown
>
  {/* Left: Text content */}
  <div className="space-y-8">
    <h1 className="text-5xl font-extrabold text-[#F0E4D7]">
    ጋሻ Scanners
    </h1>
    <p className="text-lg leading-relaxed max-w-xl text-[#E6D7C1]">
      Scan your web apps for vulnerabilities before attackers do. Identify weak spots,
      misconfigurations, and potential exploits, and take action to secure your systems.
    </p>
   
  </div>

  {/* Right: Illustration */}
  {/* Right: Illustration */}
{/* Right: Illustration */}
{/* Right: Illustration */}
{/* Right: Illustration */}
{/* Right: Illustration */}
{/* Right: Illustration */}
<div className="flex justify-center relative w-full">
  <a 
    href="https://imgbb.com/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-full flex justify-center"
  >
    <img
      src="https://i.ibb.co/Y7Ch6fNL/oooo.png"
      alt="Illustration"
      className="w-full md:w-3/4 lg:w-4/5 floating-hero transition-transform transform hover:scale-105 hover:rotate-1"
    />
  </a>

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

  <section className="max-w-7xl mx-auto p-8 space-y-12 font-sans">

  {/* Hero */}
  <div className="bg-[#6F4E37] rounded-xl shadow-lg p-10 text-white text-center border-2 border-[#A95A3C]">
   
    <p className="text-[#E6D7C1] max-w-3xl mx-auto mb-6 text-lg md:text-xl leading-relaxed">
      Enterprise-ready web vulnerability scanner with production-safe heuristics, advanced tool integration, and strict safety controls.
    </p>
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      <span className="px-4 py-2 bg-[#593127] rounded-full text-[#E6D7C1] border border-[#A95A3C]">Enterprise Ready</span>
      <span className="px-4 py-2 bg-[#A95A3C] rounded-full text-white border border-white">Production-Safe</span>
      <span className="px-4 py-2 bg-[#4B2E2E] rounded-full text-[#E6D7C1] border border-[#A95A3C]">Advanced Tools</span>
    </div>
  </div>

  {/* Features Grid */}
  <h2 className="text-3xl font-bold text-center text-[#F0E4D7] mb-6">What We Do</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[
      {
        title: "Core Vulnerability Detection",
        items: [
          "SQL Injection - Safe payloads & context analysis",
          "Cross-Site Scripting (XSS) - Reflected detection",
          "Security Headers - TLS & headers validation",
          "CSRF Protection - Automated state-changing checks",
          "IDOR Testing - Direct object reference checks",
          "SSRF Detection - Server-side request forgery",
          "Open Redirect - Controlled testing"
        ],
        bg: "#7A5947"
      },
      {
        title: "Production-Grade Safety",
        items: [
          "Safe Heuristics - Production-safe checks",
          "Rate Limiting - Prevent overload",
          "Audit Logging - Full activity trail",
          "Target Allowlisting - Mandatory validation",
          "Time Windows - Scheduled scans"
        ],
        bg: "#6F4E37"
      },
      {
        title: "Advanced Tool Integration",
        items: [
          "SQLMap Integration - Safe automated testing",
          "Human Approval Workflow - Mandatory authorization",
          "Isolated Execution - Jump host operations",
          "Evidence Handling - Secure collection & sanitization"
        ],
        bg: "#593127"
      }
    ].map((section, idx) => (
      <div 
        key={idx} 
        style={{ backgroundColor: section.bg }}
        className="rounded-xl shadow-lg p-6 hover:shadow-2xl transition border-2 border-[#A95A3C]"
      >
        <h2 className="text-2xl font-bold text-[#F0E4D7] mb-4">{section.title}</h2>
        <ul className="space-y-2 text-[#E6D7C1] text-sm">
          {section.items.map((item, i) => <li key={i}>• {item}</li>)}
        </ul>
      </div>
    ))}
  </div>

  {/* Safety & Tools Section */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
    {/* Safety Cards */}
    <div className="space-y-4">
      {["Safe Heuristics", "Rate Limiting", "Audit Logging", "Target Allowlisting", "Time Windows"].map((item, i) => (
        <div key={i} className="bg-[#6F4E37] p-5 rounded-xl hover:bg-[#7A5947] transition border-2 border-[#A95A3C]">
          <h3 className="font-semibold text-[#F0E4D7]">{item}</h3>
          <p className="text-[#E6D7C1] text-sm mt-1">Explanation for {item.toLowerCase()} ensuring production safety.</p>
        </div>
      ))}
    </div>

    {/* Tools Accordion */}
    <div className="space-y-3">
      {["SQLMap Integration", "Human Approval Workflow", "Isolated Execution", "Evidence Handling"].map((tool, i) => (
        <details key={i} className="bg-[#593127] p-4 rounded-xl open:ring-2 open:ring-[#A95A3C] border-2 border-[#A95A3C]">
          <summary className="cursor-pointer font-semibold text-[#F0E4D7]">{tool}</summary>
          <p className="mt-2 text-[#E6D7C1] text-sm">Safe execution, human approval, and encrypted evidence storage.</p>
        </details>
      ))}
    </div>
  </div>



  {/* News Section */}
 <div className="bg-[#6F4E37] rounded-xl shadow-lg p-8 text-white">
  <h2 className="text-3xl font-bold mb-6 text-center text-[#F0E4D7]">Security News & Alerts</h2>
  
  <div className="overflow-x-auto">
    <table className="min-w-full text-left border-collapse">
      <thead className="bg-[#7A5947]">
        <tr>
          {["Type", "Title", "Severity", "Date", "Action"].map((th, i) => (
            <th key={i} className="px-6 py-3 text-sm font-semibold">{th}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#5A2D1D]">
        <tr className="hover:bg-[#593127] transition-colors">
          <td className="px-6 py-4 text-[#E6D7C1]">Firewall</td>
          <td className="px-6 py-4 font-medium text-[#F0E4D7]">Critical Cisco Vulnerabilities</td>
          <td className="px-6 py-4"><span className="px-2 py-1 bg-red-700 rounded-full text-xs text-white">Critical</span></td>
          <td className="px-6 py-4 text-[#E6D7C1]">Oct 3, 2025</td>
          <td className="px-6 py-4">
            <a href="#" className="px-3 py-1 bg-[#A95A3C] hover:bg-[#B66A4C] rounded-md text-white text-sm transition">View</a>
          </td>
        </tr>

        <tr className="hover:bg-[#593127] transition-colors">
          <td className="px-6 py-4 text-[#E6D7C1]">Data Breach</td>
          <td className="px-6 py-4 font-medium text-[#F0E4D7]">Kido Nursery Data Breach: 8,000 Children Affected</td>
          <td className="px-6 py-4"><span className="px-2 py-1 bg-orange-700 rounded-full text-xs text-white">High</span></td>
          <td className="px-6 py-4 text-[#E6D7C1]">Oct 2, 2025</td>
          <td className="px-6 py-4">
            <a href="#" className="px-3 py-1 bg-[#A95A3C] hover:bg-[#B66A4C] rounded-md text-white text-sm transition">View</a>
          </td>
        </tr>

        <tr className="hover:bg-[#593127] transition-colors">
          <td className="px-6 py-4 text-[#E6D7C1]">Malware</td>
          <td className="px-6 py-4 font-medium text-[#F0E4D7]">China-Linked Group Deploys New Malware</td>
          <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-700 rounded-full text-xs text-white">Medium</span></td>
          <td className="px-6 py-4 text-[#E6D7C1]">Oct 1, 2025</td>
          <td className="px-6 py-4">
            <a href="#" className="px-3 py-1 bg-[#A95A3C] hover:bg-[#B66A4C] rounded-md text-white text-sm transition">View</a>
          </td>
        </tr>

        <tr className="hover:bg-[#593127] transition-colors">
          <td className="px-6 py-4 text-[#E6D7C1]">AI Security</td>
          <td className="px-6 py-4 font-medium text-[#F0E4D7]">AI Threats Escalate Amid Budget Cuts</td>
          <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-700 rounded-full text-xs text-white">Medium</span></td>
          <td className="px-6 py-4 text-[#E6D7C1]">Oct 1, 2025</td>
          <td className="px-6 py-4">
            <a href="#" className="px-3 py-1 bg-[#A95A3C] hover:bg-[#B66A4C] rounded-md text-white text-sm transition">View</a>
          </td>
        </tr>

        <tr className="hover:bg-[#593127] transition-colors">
          <td className="px-6 py-4 text-[#E6D7C1]">Web App</td>
          <td className="px-6 py-4 font-medium text-[#F0E4D7]">New XSS Vulnerability in Popular CMS</td>
          <td className="px-6 py-4"><span className="px-2 py-1 bg-orange-700 rounded-full text-xs text-white">High</span></td>
          <td className="px-6 py-4 text-[#E6D7C1]">Sep 30, 2025</td>
          <td className="px-6 py-4">
            <a href="#" className="px-3 py-1 bg-[#A95A3C] hover:bg-[#B66A4C] rounded-md text-white text-sm transition">View</a>
          </td>
        </tr>

      </tbody>
    </table>
  </div>

  <div className="mt-6 bg-[#593127] p-4 rounded-lg text-center text-[#E6D7C1]">
    Stay updated on security threats to protect your systems and reputation.
  </div>
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
