import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ScannersPage from "./pages/ScannersPage";
import WebAppsScannerPage from "./pages/WebAppsScannerPage";
import BanksScannerPage from "./pages/BanksScannerPage";
import ECommerceScannerPage from "./pages/ECommerceScannerPage";
import ReportsPage from "./pages/ReportsPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Scanners" element={<ScannersPage />} />
       < Route path="/webapps" element={<WebAppsScannerPage />} />
        <Route path="/banks" element={<BanksScannerPage />} />
        <Route path="/ecommerce" element={<ECommerceScannerPage />} />
        <Route path ="/reports" element={<ReportsPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
