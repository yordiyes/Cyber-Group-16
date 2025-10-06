import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ScannersPage from "./pages/ScannersPage";
import WebAppsScannerPage from "./pages/WebAppsScannerPage";
import BanksScannerPage from "./pages/BanksScannerPage";
import ECommerceScannerPage from "./pages/ECommerceScannerPage";
import ReportsPage from "./pages/ReportsPage";
import Services from "./pages/Services"; // ✅ Import your Services page

// Components
import Navbar from "./components/Navbar";

const AppContent = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();

  // Hide Navbar only on login page
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/services" element={<Services />} /> {/* ✅ Added route for Services */}

        {/* Protected Routes */}
        <Route
          path="/scanners"
          element={isLoggedIn ? <ScannersPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/webapps"
          element={isLoggedIn ? <WebAppsScannerPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/banks"
          element={isLoggedIn ? <BanksScannerPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/ecommerce"
          element={isLoggedIn ? <ECommerceScannerPage /> : <Navigate to="/login" />}
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

  return (
    <Router>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
};

export default App;
