import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiMapPin, FiUser, FiCreditCard, FiClock } from "react-icons/fi";
import { orderAPI } from "../services/api";

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderAPI.getById(orderId); // API: /api/orders/:id
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-6 text-center text-red-500">Order not found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link
        to="/dashboard/orders"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <FiArrowLeft /> Back to Orders
      </Link>

      <h1 className="text-2xl font-bold text-gray-800">
        Order #{order._id.slice(-6)}
      </h1>

      {/* Customer Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-4 space-y-3"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiUser /> Customer
        </h2>
        <p className="text-gray-700">{order.customerName}</p>
        <p className="text-gray-600">{order.customerEmail}</p>
        <p className="text-gray-600">{order.customerPhone}</p>
      </motion.div>

      {/* Address */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-4 space-y-3"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiMapPin /> Shipping Address
        </h2>
        <p className="text-gray-700">{order.address?.street}</p>
        <p className="text-gray-600">
          {order.address?.city}, {order.address?.state} - {order.address?.pincode}
        </p>
      </motion.div>

      {/* Order Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-4 space-y-3"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiClock /> Order Details
        </h2>
        <p className="text-gray-700">Status: {order.orderStatus}</p>
        <p className="text-gray-600">
          Placed On: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
        </p>
        <p className="text-gray-600">Payment: {order.paymentMethod}</p>
        <p className="text-gray-700 font-semibold">
          Total: ₹{order.totalAmount}
        </p>
      </motion.div>

      {/* Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-4"
      >
        <h2 className="text-lg font-semibold mb-3">Items</h2>
        <div className="space-y-4">
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 border-b pb-3 last:border-b-0"
            >
              <img
                src={item.image ? `http://localhost:5000${item.image}` : "/placeholder.jpg"}
                alt={item.name}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>
              <p className="font-semibold">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
