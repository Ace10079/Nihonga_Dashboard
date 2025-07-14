import React from 'react';
import { FiBox, FiUsers, FiBarChart2, FiShoppingCart, FiSettings } from 'react-icons/fi';

const stats = [
  { title: "Total Products", value: 120, icon: <FiBox className="text-blue-600" /> },
  { title: "Total Orders", value: 345, icon: <FiShoppingCart className="text-green-600" /> },
  { title: "Total Users", value: 89, icon: <FiUsers className="text-purple-600" /> },
  { title: "Revenue", value: "$12,340", icon: <FiBarChart2 className="text-yellow-600" /> },
];

const Admin = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Product Manager</h2>
          <p className="text-sm text-gray-600">Add, edit, or delete your products here.</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Order Manager</h2>
          <p className="text-sm text-gray-600">Track and manage customer orders.</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">User Manager</h2>
          <p className="text-sm text-gray-600">Manage registered customers and admin roles.</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Reports</h2>
          <p className="text-sm text-gray-600">Analyze sales, product performance, and trends.</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Settings</h2>
          <p className="text-sm text-gray-600">Configure website options and email templates.</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;