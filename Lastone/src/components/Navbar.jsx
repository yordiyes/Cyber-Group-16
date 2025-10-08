import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      ? [{ name: "Login", path: "/login" }]
      : [
          {
            name: "Profile",
            path: "#",
            onClick: () => setProfileOpen(!profileOpen),
          },
        ]),
  ];

  const handleLogout = () => {
    setProfileOpen(false);
    if (onLogout) onLogout(); // trigger logout function from parent
    navigate("/login");
  };

  return (
    <nav className="bg-[#6F4E37] sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.6)] border-b-2 border-[#593127]">
      <div className="w-full px-4 md:px-8">
        <div className="flex items-center justify-between h-24 relative">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer animate-logo-forward-back"
            onClick={() => navigate("/home")}
          >
            <img
              src="https://i.ibb.co/nNMjgXms/2-removebg-preview.png"
              alt="Logo"
              className="h-27 w-auto"
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 ml-12">
            {linksToShow.map((link, idx) =>
              link.onClick && link.name === "Profile" ? (
                <div key={idx} className="relative">
                  <button
                    onClick={link.onClick}
                    className="text-white font-extrabold text-lg flex items-center gap-1 hover:text-yellow-300 transition"
                  >
                    {user?.name || link.name} ▼
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#6F4E37] text-white rounded-md shadow-lg py-2 z-50 border border-gray-700">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 hover:bg-[#7F5C48] transition"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-[#7F5C48] transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : link.onClick ? (
                <button
                  key={idx}
                  onClick={link.onClick}
                  className="text-white font-extrabold text-lg hover:text-yellow-300 transition"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={idx}
                  to={link.path}
                  className="text-white font-extrabold text-lg hover:text-yellow-300 transition"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border rounded text-white hover:text-yellow-300 hover:bg-[#7F5C48] transition"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Links */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#6F4E37] w-full shadow-md border-t border-gray-700">
          {linksToShow.map((link, idx) =>
            link.onClick && link.name === "Profile" ? (
              <div key={idx} className="border-b border-gray-700">
                <button
                  onClick={link.onClick}
                  className="w-full text-left px-4 py-3 text-white font-extrabold flex justify-between items-center hover:text-yellow-300 transition"
                >
                  {user?.name || link.name} ▼
                </button>
                {profileOpen && (
                  <div className="bg-[#6F4E37]">
                    <Link
                      to="/profile"
                      onClick={() => {
                        setProfileOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block px-6 py-2 text-white hover:bg-[#7F5C48]"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-6 py-2 text-white hover:bg-[#7F5C48]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-white font-extrabold hover:text-yellow-300 transition border-b border-gray-700"
              >
                {link.name}
              </Link>
            )
          )}
        </div>
      )}

      {/* Tailwind Custom Animation */}
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
