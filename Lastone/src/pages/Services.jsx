import React from "react";

const ServicesPage = () => {
  const offerings = [
    {
      title: "Web Applications",
      description:
        "Our web application scanner deeply inspects modern frameworks, APIs, and server configurations. It identifies SQL Injection, XSS, and CSRF vulnerabilities — without disrupting production. Each scan report includes guided fixes and risk levels for developers.",
      icon: "🌐",
      gradient: "from-green-500 to-black-200",
    },
    {
      title: "Banking Platforms",
      description:
        "Designed for financial institutions, this scanner focuses on authentication, encryption, and transaction security. It meets industry compliance standards while testing safely in live environments — keeping customer data and business reputation protected.",
      icon: "🏦",
      gradient: "from-pink-600 to-emerald-700",
    },
    {
      title: "E-commerce Systems",
      description:
        "Our e-commerce scanner ensures secure checkout experiences by protecting against CSRF, XSS, payment gateway misconfigurations, and data leaks. Protect customers and maintain compliance with advanced monitoring and threat intelligence.",
      icon: "🛒",
      gradient: "from-brown-500 to-rose-600",
    },
  ];

  return (
    <div className="relative min-h-screen px-6 md:px-16 py-20 bg-[#fdf5e6] overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-40">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40 L40 0" stroke="#D9B382" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-[#8B5E3C]">
          ጋሻ <span className="text-[#C29157]">Scanners & Services</span>
        </h1>
        <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-700 leading-relaxed">
          Gasha delivers enterprise-grade vulnerability scanning and security services
          tailored for high-impact environments. Built with safety, precision, and a
          deep understanding of modern systems.
        </p>
      </div>

      {/* Section 1 — What Makes Gasha Unique */}
      <section className="relative z-10 bg-white rounded-2xl shadow-xl p-10 md:p-16 border-l-8 border-[#8B5E3C] mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-[#5C3A21] mb-6">
          🛡 Why Choose Gasha Scanners
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Gasha is more than just a scanner — it's a fully managed security ecosystem. Our
          approach blends automation with human review, ensuring each vulnerability report
          is accurate, relevant, and verified. With production-safe heuristics and
          intelligent rate controls, you can run continuous scans confidently — even in
          live systems.
        </p>
      </section>

      {/* Section 2 — Core Services */}
      <section className="relative z-10 grid md:grid-cols-3 gap-10">
        {offerings.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.gradient} text-white p-8 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl`}
          >
            <div className="text-6xl mb-6">{item.icon}</div>
            <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
            <p className="text-base leading-relaxed opacity-90">{item.description}</p>
          </div>
        ))}
      </section>

      {/* Section 3 — Integrated Protection */}
      <section className="relative z-10 mt-24 bg-[#fffaf0] rounded-2xl shadow-lg p-10 md:p-16 border-l-8 border-[#C29157]">
        <h2 className="text-3xl md:text-4xl font-bold text-[#5C3A21] mb-6">
          🔒 Integrated Protection at Every Layer
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Gasha scanners work hand-in-hand with your existing tools and workflows. Our
          integrations cover databases, cloud services, and network infrastructures —
          offering one unified security experience. Whether you’re monitoring APIs,
          financial systems, or user authentication layers, Gasha provides continuous
          visibility and control.
        </p>
        <ul className="text-gray-800 text-lg list-disc ml-8 space-y-2">
          <li>Safe and controlled vulnerability detection</li>
          <li>Advanced reporting with clear remediation steps</li>
          <li>Real-time alerts and intelligent prioritization</li>
          <li>Custom dashboards for enterprise visibility</li>
        </ul>
      </section>

      {/* Section 4 — Our Vision */}
      <section className="relative z-10 mt-24 bg-white rounded-2xl shadow-md p-10 md:p-16 border-l-8 border-[#8B5E3C] text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#5C3A21] mb-6">
          🌍 Our Vision
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
          At ጋሻ Security Labs, our vision is to empower African organizations with the
          cybersecurity tools they deserve — blending cultural integrity, modern
          innovation, and digital resilience. We believe in proactive defense, knowledge
          sharing, and technology that respects both performance and safety.
        </p>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 text-center mt-24 py-6 border-t border-[#8B5E3C] text-sm text-gray-600">
        © {new Date().getFullYear()} ጋሻ Security Labs. All rights reserved.
      </footer>
    </div>
  );
};

export default ServicesPage;
