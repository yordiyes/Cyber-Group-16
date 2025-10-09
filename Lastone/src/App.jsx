import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ScannersPage from "./pages/ScannersPage";
import WebAppsScannerPage from "./pages/WebAppsScannerPage";
import BanksScannerPage from "./pages/BanksScannerPage";
import ECommerceScannerPage from "./pages/ECommerceScannerPage";
import ReportsPage from "./pages/ReportsPage";
import Services from "./pages/Services";
import ContactPage from "./pages/ContactPage"; // Keep from frontend branch

// Components
import Navbar from "./components/Navbar";

const AppContent = ({
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
  handleLogout,
}) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && (
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          user={user}
          setUser={setUser}
          handleLogout={handleLogout}
        />
      )}
      <Routes>
        {/* 🌍 Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <LoginPage setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
          }
        />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactPage />} />{" "}
        {/* Added contact */}
        {/* 🔒 Protected routes */}
        <Route
          path="/scanners"
          element={isLoggedIn ? <ScannersPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/webapps"
          element={
            isLoggedIn ? <WebAppsScannerPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/banks"
          element={isLoggedIn ? <BanksScannerPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/ecommerce"
          element={
            isLoggedIn ? <ECommerceScannerPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/reports"
          element={isLoggedIn ? <ReportsPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Load login state and user from localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <AppContent
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
        setUser={setUser}
        handleLogout={handleLogout}
      />
    </Router>
  );
};

export default App;
