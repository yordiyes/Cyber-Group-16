// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const navbarLinks = [
  { name: "Dashboard", path: "/" },
  { name: "Scanners", path: "/scanners" },
  { name: "About Us", path: "/about" },
  { name:" Reports" , path:"/reports" },
  { name: "Login / Signup", path: "/login"},
  
];

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Site Name */}
          <div className="text-2xl font-bold">VulnScanner</div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navbarLinks.map((link, idx) => (
              <Link key={idx} to={link.path} className="hover:text-blue-400 transition font-semibold">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu placeholder */}
          <div className="md:hidden">
            <button>Menu</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;