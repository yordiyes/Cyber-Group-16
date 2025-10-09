import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

const infoTexts = [
  "Scan your web apps for vulnerabilities in seconds.",
  "Identify security issues before attackers do.",
  "Protect your users and maintain trust.",
  "Empowering developers to build secure apps.",
];

const LoginPage = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate(); // ✅ Add this line
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [currentInfo, setCurrentInfo] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInfo((prev) => (prev + 1) % infoTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/login", {
        username: email, // Using email as username for now
        password: password,
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsLoggedIn(true);
      setUser(response.data.user);

      setSuccessMessage("Login successful! Redirecting...");
      setShowSuccess(true);

      // ✅ Navigate after short delay
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error.response || error);
      alert("Invalid credentials!");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill in all fields!");
      return;
    }
    try {
      const response = await apiClient.post("/auth/register", {
        username: email, // Using email as username
        email: email,
        full_name: name,
        password: password,
      });

      setSuccessMessage("Account created successfully! Please login.");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsLogin(true);
      }, 2000);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Signup error:", error.response || error);
      alert(error.response?.data?.detail || "Registration failed!");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ backgroundColor: "#4B2E2A" }}
    >
      {/* Left info panel */}
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-center items-center p-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,215,0,0.05) 0 2px, transparent 2px 20px), repeating-linear-gradient(-45deg, rgba(255,215,0,0.03) 0 2px, transparent 2px 20px)",
          }}
        ></div>

        <h1 className="text-4xl font-bold mb-4 text-yellow-200 z-10">
          Welcome to ጋሻ Scanners
        </h1>
        <p className="text-lg text-center leading-relaxed mb-6 text-yellow-100 z-10">
          {infoTexts[currentInfo]}
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
          alt="Security illustration"
          className="w-48 h-48 mt-4 z-10"
          style={{ animation: "floatHero 6s ease-in-out infinite" }}
        />
        <style>{`
          @keyframes floatHero {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
        `}</style>
      </div>

      {/* Right form panel */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="bg-[#FDF1E3] shadow-2xl rounded-2xl p-10 w-11/12 sm:w-3/4 md:w-2/3">
          {/* Tabs */}
          <div className="flex justify-center mb-8 border-b border-yellow-400">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 font-semibold ${
                isLogin
                  ? "border-b-4 border-yellow-500 text-yellow-700"
                  : "text-gray-600 hover:text-yellow-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 font-semibold ${
                !isLogin
                  ? "border-b-4 border-yellow-500 text-yellow-700"
                  : "text-gray-600 hover:text-yellow-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form
            onSubmit={isLogin ? handleLogin : handleSignup}
            className="space-y-5"
          >
            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-[#4B2E2A] font-semibold py-3 rounded-lg hover:bg-yellow-600 transition"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {showSuccess && (
            <div className="mt-4 text-green-700 text-center font-semibold">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
