import React, { useState } from "react";
import { FiEye, FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";

const dummyOrders = Array.from({ length: 12 }, (_, i) => ({
  id: 1000 + i,
  customer: `Customer ${i + 1}`,
  date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  status: i % 4 === 0 ? "Delivered" : i % 4 === 1 ? "Pending" : i % 4 === 2 ? "Cancelled" : "Shipped",
  total: (Math.random() * 200 + 20).toFixed(2),
  method: i % 2 === 0 ? "Credit Card" : "PayPal"
}));

const statusColors = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-600",
  Shipped: "bg-blue-100 text-blue-600"
};

export default function Orders() {
  const [orders, setOrders] = useState(dummyOrders);
  const [search, setSearch] = useState("");

  const filtered = orders.filter(order =>
    order.customer.toLowerCase().includes(search.toLowerCase()) ||
    order.id.toString().includes(search)
  );

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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700">Order #{order.id}</h2>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">👤 {order.customer}</p>
            <p className="text-sm text-gray-600">📅 {order.date}</p>
            <p className="text-sm text-gray-600">💳 {order.method}</p>
            <p className="text-sm text-gray-600">💰 ${order.total}</p>
            <div className="flex justify-end mt-4">
              <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                <FiEye /> View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
