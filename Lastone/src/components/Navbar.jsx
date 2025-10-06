import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const linksToShow = [
    { name: "Home", path: "/home" },
    ...(isLoggedIn
      ? [
          { name: "Scanners", path: "/scanners" },
          { name: "Reports", path: "/reports" },
        ]
      : []),
    { name: "Services", path: "/services" },
    { name: "Contact Us", path: "/contact" },
    ...(!isLoggedIn
      ? [{ name: "Login / Signup", path: "/login" }]
      : [{ name: "Profile", path: "#", onClick: () => setProfileOpen(!profileOpen) }]),
  ];

  return (
    <nav className="text-white shadow-md sticky top-0 z-50" style={{ backgroundColor: "#8B5E3C" }}>
      <div className="w-full px-4 relative">
        <div className="flex items-center h-24 relative">
          {/* Logo with forward/back animation */}
          <div
            className="flex-shrink-0 cursor-pointer animate-logo-forward-back"
            onClick={() => navigate("/home")}
          >
            <img
              src="https://i.ibb.co/nNMjgXms/2-removebg-preview.png"
              alt="Logo"
              className="h-32 w-auto"
            />
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/5 gap-8">
            {linksToShow.map((link, idx) =>
              link.onClick && link.name === "Profile" ? (
                <div key={idx} className="relative">
                  <button
                    onClick={link.onClick}
                    className="hover:text-yellow-300 font-semibold transition text-lg flex items-center gap-1"
                  >
                    {link.name} ▼
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-[#5C3A21] text-white rounded-md shadow-lg py-2 z-50 border border-[#422A17]">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-[#7A5031] transition"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 hover:bg-[#7A5031] transition"
                      >
                        Settings
                      </Link>
                    </div>
                  )}
                </div>
              ) : link.onClick ? (
                <button
                  key={idx}
                  onClick={link.onClick}
                  className="hover:text-yellow-300 font-semibold transition text-lg"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={idx}
                  to={link.path}
                  className="hover:text-yellow-300 transition font-semibold text-lg"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden ml-auto mr-4">
            <button className="p-2 border rounded hover:bg-white/20 text-black">☰</button>
          </div>
        </div>
      </div>

      {/* Tailwind custom animation */}
      <style>
        {`
          @keyframes logo-forward-back {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          .animate-logo-forward-back {
            animation: logo-forward-back 2s ease-in-out infinite alternate;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
