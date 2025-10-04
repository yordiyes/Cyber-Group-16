import React from "react";
import Navbar from "../components/Navbar";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center items-center px-6">
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <p className="text-gray-700 mb-6 text-center">
          Update your preferences and account information here.
        </p>
        <form className="flex flex-col gap-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Save Settings
          </button>
        </form>
      </main>
    </div>
  );
};

export default SettingsPage;
