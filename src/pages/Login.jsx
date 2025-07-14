import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add real login logic here
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Branding / Image Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-white text-5xl font-bold tracking-wide mb-4">Nihonga</h1>
          <p className="text-white text-lg">
            Manage your products, orders, and inventory — all in one place.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891419.png"
            alt="Shopping Illustration"
            className="w-80 mt-10"
          />
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-gray-100">
        <div className="bg-white px-10 py-12 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Welcome Back</h2>
          <p className="text-sm text-center text-gray-500 mb-8">Login to your Nihonga admin panel</p>

          {/* ✅ Fix: onSubmit on the form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@nihonga.com"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-400">
            &copy; 2025 Nihonga Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
