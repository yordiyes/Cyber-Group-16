import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const navigate = useNavigate();

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin") {
      navigate("/"); // navigate to Dashboard
    } else {
      alert("Invalid credentials!");
    }
  };

  // Handle signup
  const handleSignup = (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      alert("Passwords do not match!");
      return;
    }
    alert(`Account created for ${signupEmail}!`);
    setShowSignup(false);
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirm("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold">VulnScanner</div>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="hover:text-blue-400 transition font-semibold">
                Dashboard
              </Link>
              <Link to="/scanners" className="hover:text-blue-400 transition font-semibold">
                Scanners
              </Link>
              <Link to="/about" className="hover:text-blue-400 transition font-semibold">
                About Us
              </Link>
              <button
                onClick={() => setShowSignup(true)}
                className="hover:text-blue-400 transition font-semibold"
              >
                Sign Up
              </button>
            </div>
            <div className="md:hidden">
              <button>Menu</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center flex-grow bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow-md w-80 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 mb-3 rounded focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 mb-3 rounded focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded mb-4 hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setShowSignup(true)}
              className="text-blue-600 font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-96 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 text-xl font-bold hover:text-gray-800"
              onClick={() => setShowSignup(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-800">
              Sign Up
            </h2>
            <form onSubmit={handleSignup} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 font-bold transition"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
