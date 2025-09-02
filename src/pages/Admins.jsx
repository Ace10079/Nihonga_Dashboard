import React, { useEffect, useState } from "react";
import { getAdmins, createAdmin, deleteAdmin } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return alert("All fields are required");
    try {
      await createAdmin(newAdmin);
      setShowModal(false);
      setNewAdmin({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await deleteAdmin(id);
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Admins</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {admins.map((admin) => (
            <motion.div
              key={admin._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-4 rounded-2xl shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center space-x-4">
                
                <div>
                  <h2 className="font-semibold">{admin.name}</h2>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-400">{admin.role || "Admin"}</span>
                <button
                  onClick={() => handleDeleteAdmin(admin._id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-md flex items-center space-x-1"
                >
                  <FiTrash2 /> <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Add Admin Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
      >
        <FiPlus className="text-xl" />
      </button>

      {/* Add Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Admin</h2>
            <input
              type="text"
              placeholder="Name"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdmin}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
