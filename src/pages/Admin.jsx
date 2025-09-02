import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBox, FiUsers, FiBarChart2, FiShoppingCart, FiShield } from "react-icons/fi";
import { getUsers, getAdmins, getProducts } from "../services/api";

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0, // Can be updated once orders API is available
    totalUsers: 0,
    totalAdmins: 0,
    revenue: "$0", // Placeholder until revenue API is implemented
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersData, adminsData, productsData] = await Promise.all([
        getUsers(),
        getAdmins(),
        getProducts(),
      ]);

      setStats({
        totalProducts: productsData.length || 0,
        totalOrders: 0, // Replace with getOrders() if available
        totalUsers: usersData.length || 0,
        totalAdmins: adminsData.length || 0,
        revenue: "$12,340", // Replace with actual API if needed
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const cards = [
    { title: "Total Products", value: stats.totalProducts, icon: <FiBox className="text-blue-600" /> },
    { title: "Total Orders", value: stats.totalOrders, icon: <FiShoppingCart className="text-green-600" /> },
    { title: "Total Users", value: stats.totalUsers, icon: <FiUsers className="text-purple-600" /> },
    { title: "Revenue", value: stats.revenue, icon: <FiBarChart2 className="text-yellow-600" /> },
  ];
  const managementCards = [
    { title: "Manage Admins", description: `Currently ${stats.totalAdmins} admins active.`, path: "/dashboard/admins" },
    { title: "View Orders", description: "See and manage all orders.", path: "/dashboard/orders" },
    { title: "View Users", description: `Currently ${stats.totalUsers} users registered.`, path: "/dashboard/users" },
  ];
  
  

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-5 flex items-center justify-between transition transform hover:scale-105 hover:shadow-lg"
          >
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:bg-blue-50 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-2">{card.title}</h2>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
