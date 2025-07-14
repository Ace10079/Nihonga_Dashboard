import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="/dashboard/landing" />} />
          <Route path="landing" element={<Landing />} />
          <Route path="products" element={<Products />} />
          <Route path="admin" element={<Admin />} />
          <Route path="stock" element={<Stock />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
