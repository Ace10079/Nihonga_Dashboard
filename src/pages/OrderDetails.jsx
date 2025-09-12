// src/pages/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiMapPin,
  FiUser,
  FiCreditCard,
  FiClock,
  FiInfo,
  FiDownload,
} from "react-icons/fi";
import { orderAPI, BASE_URL } from "../services/api";

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderAPI.getById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await orderAPI.updateStatus(order._id, newStatus);
      setOrder({ ...order, orderStatus: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    setUpdating(true);
    try {
      await orderAPI.cancel(order._id);
      setOrder({ ...order, orderStatus: "Cancelled" });
    } catch (err) {
      console.error("Failed to cancel order:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleRefund = async () => {
    setUpdating(true);
    try {
      await orderAPI.refund(order._id);
      setOrder({ ...order, paymentStatus: "Refunded" });
    } catch (err) {
      console.error("Failed to refund order:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-red-500">Order not found.</div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/dashboard/orders"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <FiArrowLeft /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Order #{order._id.slice(-6)}
        </h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            order.orderStatus === "Delivered"
              ? "bg-green-100 text-green-700"
              : order.orderStatus === "Cancelled"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* Status & Actions */}
      <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
      <div className="flex items-center gap-3">
  <label className="text-sm font-medium">Change Status:</label>
  <select
    value={order.orderStatus}
    onChange={(e) => handleStatusChange(e.target.value)}
    disabled={updating}
    className="p-2 border rounded-lg"
  >
    {["placed", "confirmed", "shipped", "delivered", "cancelled"].map(
      (status) => (
        <option key={status} value={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </option>
      )
    )}
  </select>
</div>


        <div className="flex gap-3">
          <button
            onClick={() =>
              window.open(`${BASE_URL}/orders/${order._id}/invoice`, "_blank")
            }
            className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiDownload /> Invoice
          </button>

          {order.orderStatus !== "Cancelled" && (
            <button
              onClick={handleCancel}
              disabled={updating}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancel Order
            </button>
          )}
          {order.paymentStatus === "Paid" && (
            <button
              onClick={handleRefund}
              disabled={updating}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Refund
            </button>
          )}
        </div>
      </div>

      {/* Customer Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-5 space-y-2"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiUser /> Customer Information
        </h2>
        <p className="text-gray-700">{order.customerName}</p>
        <p className="text-gray-600">{order.customerEmail || "N/A"}</p>
        <p className="text-gray-600">{order.customerPhone || "N/A"}</p>
      </motion.div>

      {/* Address */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-5 space-y-2"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiMapPin /> Shipping Address
        </h2>
        <p className="text-gray-700">{order.address.fullName}</p>
        <p className="text-gray-600">{order.address.phone}</p>
        <p className="text-gray-700">{order.address.street}</p>
        <p className="text-gray-600">
          {order.address.city}, {order.address.state} - {order.address.pincode}
        </p>
      </motion.div>

      {/* Payment Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-5 space-y-2"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiCreditCard /> Payment & Order Info
        </h2>
        <p className="text-gray-700">
          Payment Method:{" "}
          <span className="font-medium">{order.paymentMethod}</span>
        </p>
        <p className="text-gray-700">
          Payment Status:{" "}
          <span className="font-medium">{order.paymentStatus}</span>
        </p>
        <p className="text-gray-700">
          Placed On:{" "}
          <span className="font-medium">
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </p>
        <p className="text-gray-700">
          Last Updated:{" "}
          <span className="font-medium">
            {new Date(order.updatedAt).toLocaleString()}
          </span>
        </p>
        <p className="text-xl font-bold text-gray-900">
          Total: ₹{order.totalAmount}
        </p>
      </motion.div>

      {/* Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-5"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <FiInfo /> Items Ordered
        </h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Size</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{item.productName}</td>
                <td className="p-2">{item.size || "-"}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-right">₹{item.price}</td>
                <td className="p-2 text-right">
                  ₹{item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

   {/* Activity Timeline */}
{order.statusHistory && order.statusHistory.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-lg p-6"
  >
    <h2 className="text-lg font-semibold flex items-center gap-2 mb-5">
      <FiClock className="text-blue-600" /> Activity Timeline
    </h2>

    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 h-full w-[2px] bg-gray-200"></div>

      <ul className="space-y-6">
        {order.statusHistory.map((entry, idx) => (
          <li key={idx} className="relative pl-10">
            {/* Timeline Dot */}
            <span
              className={`absolute left-2 top-1 w-4 h-4 rounded-full border-2 ${
                entry.status === "delivered"
                  ? "bg-green-500 border-green-600"
                  : entry.status === "cancelled"
                  ? "bg-red-500 border-red-600"
                  : "bg-blue-500 border-blue-600"
              }`}
            ></span>

            {/* Content */}
            <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
              <p className="font-medium capitalize">{entry.status}</p>
              <p className="text-xs text-gray-500 mt-1">
                {entry.changedAt
                  ? new Date(entry.changedAt).toLocaleString()
                  : "Unknown Date"}{" "}
                • by {entry.changedBy || "system"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
)}



      {/* Notes */}
      {order.notes && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-5"
        >
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <FiInfo /> Notes
          </h2>
          <p className="text-gray-700">{order.notes}</p>
        </motion.div>
      )}
    </div>
  );
}
