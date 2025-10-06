// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* Logo / Site Name */}
        <div className="text-2xl font-bold">VulnScanner</div>

        {/* Quick Links */}
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-blue-400 transition">Dashboard</Link>
          <Link to="/scanners" className="hover:text-blue-400 transition">Scanners</Link>
          <Link to="/about" className="hover:text-blue-400 transition">About Us</Link>
          <Link to="/login" className="hover:text-blue-400 transition">Login/Signup</Link>
        </div>

        {/* Copyright */}
        <div className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} VulnScanner. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
