import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient"; 

const infoTexts = [
  "Scan your web apps for vulnerabilities in seconds.",
  "Identify security issues before attackers do.",
  "Protect your users and maintain trust.",
  "Empowering developers to build secure apps.",
];

const LoginPage = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [currentInfo, setCurrentInfo] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // 🔁 Rotating left-side info text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInfo((prev) => (prev + 1) % infoTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Login Handler (connected to backend)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/login", {
        username: email,
        password: password,
      });

      localStorage.setItem("token", response.data.access_token);
      setIsLoggedIn(true); // <-- add this line

      setSuccessMessage("Login successful! Redirecting...");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error.response || error);
      // alert("Invalid credentials!");
    }
  };

  // 🧠 Signup Handler (connected to backend)
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/register", {
        username: email,
        password: password,
      });
      setSuccessMessage("Account created successfully!");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsLogin(true);
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error.response || error);
      alert("Signup failed!");
    }
  };

  // 🌐 Social login placeholder
  const handleSocialLogin = (provider) => {
    alert(`Social login with ${provider} coming soon!`);
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ backgroundColor: "#4B2E2A" }}
    >
      {/* Left side - Info panel */}
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

      {/* Right side - Login/Signup form */}
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

          {/* Divider */}
          <div className="my-4 flex items-center">
            <hr className="flex-grow border-yellow-200" />
            <span className="px-3 text-gray-600 text-sm">or continue with</span>
            <hr className="flex-grow border-yellow-200" />
          </div>

          {/* Social login */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="flex-1 border border-yellow-300 rounded-lg py-2 flex items-center justify-center hover:bg-yellow-50 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </button>

            <button
              onClick={() => handleSocialLogin("Microsoft")}
              className="flex-1 border border-yellow-300 rounded-lg py-2 flex items-center justify-center hover:bg-yellow-50 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft"
                className="w-5 h-5 mr-2"
              />
              Microsoft
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-green-100 border border-green-500 text-green-700 p-6 rounded shadow-lg w-80 text-center">
            {successMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
