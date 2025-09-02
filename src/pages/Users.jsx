import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiPhone, FiMail, FiSearch } from "react-icons/fi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
  );

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-2 bg-white shadow-md rounded-xl px-4 py-2 max-w-md">
        <FiSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by name or phone..."
          className="flex-1 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-white to-gray-100 p-5 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all"
            >
              <div className="space-y-2">
                <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                  <FiUser className="text-blue-600" />
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <FiMail className="text-gray-500" /> {user.email}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <FiPhone className="text-gray-500" /> {user.phone || "N/A"}
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(user)}
                className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              User Details
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Name:</strong> {selectedUser.firstName}{" "}
                {selectedUser.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {selectedUser.city || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {selectedUser.state || "N/A"}
              </p>
              <p>
                <strong>Pincode:</strong> {selectedUser.pincode || "N/A"}
              </p>
              <p>
                <strong>Account Created:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Users;
