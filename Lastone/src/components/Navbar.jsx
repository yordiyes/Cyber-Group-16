import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn, user }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setProfileOpen(false);
    navigate("/login");
  };

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
      : [{ name: "Profile", path: "#" }]),
  ];

  return (
    <nav className="bg-[#6F4E37] text-white sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.6)] border-b-2 border-[#593127]">
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

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 ml-12">
            {linksToShow.map((link, idx) =>
              link.name === "Profile" ? (
                <div
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button className="font-extrabold text-lg flex items-center gap-1 hover:text-yellow-300 transition cursor-pointer">
                    {link.name}{" "}
                    <span
                      className={`transition-transform duration-300 ${
                        profileOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Profile dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-56 bg-[#5C3A21] text-white rounded-md shadow-lg py-2 z-50 border border-[#422A17] transition-all duration-200 ${
                      profileOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2"
                    }`}
                  >
                    <div className="px-4 py-2 border-b border-[#6F4E37]">
                      <p className="font-semibold">Name:</p>
                      <p className="text-sm text-[#E6D7C1]">{user?.name}</p>
                    </div>
                    <div className="px-4 py-2 border-b border-[#6F4E37]">
                      <p className="font-semibold">Email:</p>
                      <p className="text-sm text-[#E6D7C1]">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-[#7A5031] transition text-red-300"
                    >
                      Logout
                    </button>
                  </div>
                </div>
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

          {/* Mobile menu button */}
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

      {/* Mobile menu links */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#6F4E37] w-full shadow-md border-t border-gray-700">
          {linksToShow.map((link, idx) =>
            link.name === "Profile" ? (
              <div key={idx} className="border-b border-gray-700">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-full text-left px-4 py-3 text-white font-extrabold flex justify-between items-center hover:text-yellow-300 transition"
                >
                  {link.name} ▼
                </button>
                {profileOpen && (
                  <div className="bg-[#5C3A21] px-6 py-2 text-sm text-[#E6D7C1]">
                    <p>
                      <strong>Name:</strong> {user?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="mt-2 text-red-300 hover:underline"
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
                className="block px-4 py-3 text-white font-extrabold hover:text-yellow-300 transition border-b border-gray-700"
              >
                {link.name}
              </Link>
            )
          )}
        </div>
      )}

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
