import React, { useState, useEffect } from "react";
import { FiEye, FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";

const statusColors = {
  placed: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-600",
  shipped: "bg-indigo-100 text-indigo-600",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getAll(); // Fetch all admin orders
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter(
    (order) =>
      order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      order._id?.toString().includes(search)
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by customer or ID"
            className="px-3 py-2 border rounded-md shadow-sm text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="flex items-center gap-1 px-3 py-2 border rounded hover:bg-gray-100 text-sm">
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No orders found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Order #{order._id.slice(-6)}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.orderStatus || "Unknown"}
                </span>
              </div>
              <p className="text-sm text-gray-600">👤 {order.customerName}</p>
              <p className="text-sm text-gray-600">
                📅 {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-sm text-gray-600">💳 {order.paymentMethod}</p>
              <p className="text-sm text-gray-600">💰 ₹{order.totalAmount}</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <FiEye /> View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
