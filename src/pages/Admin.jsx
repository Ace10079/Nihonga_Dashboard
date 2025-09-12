import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBox, FiUsers, FiBarChart2, FiShoppingCart, FiHeart } from "react-icons/fi";
import { getUsers, getAdmins, getProducts, getAllCarts } from "../services/api";

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0, // Can update later
    totalUsers: 0,
    totalAdmins: 0,
    revenue: "$0",
    totalCartItems: 0,
    totalWishlistItems: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersData, adminsData, productsData, cartsData] = await Promise.all([
        getUsers(),
        getAdmins(),
        getProducts(),
        getAllCarts(), // Fetch all carts for stats
      ]);

      let cartCount = 0;
      cartsData.forEach(cart => (cartCount += cart.items.length));

      let wishlistCount = 0;
      usersData.forEach(user => (wishlistCount += user.wishlist?.length || 0));

      setStats({
        totalProducts: productsData.length || 0,
        totalOrders: 0,
        totalUsers: usersData.length || 0,
        totalAdmins: adminsData.length || 0,
        revenue: "$12,340",
        totalCartItems: cartCount,
        totalWishlistItems: wishlistCount,
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
    { title: "Cart Items", value: stats.totalCartItems, icon: <FiShoppingCart className="text-pink-600" /> },
    { title: "Wishlist Items", value: stats.totalWishlistItems, icon: <FiHeart className="text-red-600" /> },
  ];

  const managementCards = [
    { title: "Manage Admins", description: `Currently ${stats.totalAdmins} admins active.`, path: "/dashboard/admins" },
    { title: "View Orders", description: "See and manage all orders.", path: "/dashboard/orders" },
    { title: "View Users", description: `Currently ${stats.totalUsers} users registered.`, path: "/dashboard/users" },
    { title: "Cart Analysis", description: "View products added to carts by users.", path: "/dashboard/carts" },
    { title: "Wishlist Analysis", description: "View products added to wishlists by users.", path: "/dashboard/wishlists" },
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
