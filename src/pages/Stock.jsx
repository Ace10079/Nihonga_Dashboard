import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';

const initialStock = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: i % 2 === 0 ? 'Clothing' : 'Footwear',
  stock: i % 4 === 0 ? 0 : Math.floor(Math.random() * 50 + 1),
}));

export default function Stock() {
  const [stockData, setStockData] = useState(initialStock);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [newQty, setNewQty] = useState('');

  const filtered = stockData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const updateStock = (id, qty) => {
    setStockData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, stock: parseInt(qty) } : item
      )
    );
    setEditing(null);
    setNewQty('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📦 Stock Management</h1>
        <input
          type="text"
          placeholder="Search by name or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
        <table className="min-w-full text-sm text-gray-800">
          <thead>
            <tr className="bg-blue-50 text-gray-700">
              <th className="py-3 px-5 text-left">Product</th>
              <th className="py-3 px-5 text-left">Category</th>
              <th className="py-3 px-5 text-left">Stock</th>
              <th className="py-3 px-5 text-left">Status</th>
              <th className="py-3 px-5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr
                key={item.id}
                className={`border-t hover:bg-gray-50 transition-all duration-200 ${
                  editing === item.id ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="py-3 px-5">{item.name}</td>
                <td className="py-3 px-5">{item.category}</td>
                <td className="py-3 px-5">{item.stock}</td>
                <td className="py-3 px-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    item.stock === 0
                      ? 'bg-red-100 text-red-600'
                      : item.stock < 10
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {item.stock === 0
                      ? 'Out of Stock'
                      : item.stock < 10
                      ? 'Low Stock'
                      : 'In Stock'}
                  </span>
                </td>
                <td className="py-3 px-5">
                  {editing === item.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateStock(item.id, newQty);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="number"
                        value={newQty}
                        onChange={(e) => setNewQty(e.target.value)}
                        className="border px-3 py-1 rounded text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition-all"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() => {
                        setEditing(item.id);
                        setNewQty(item.stock);
                      }}
                    >
                      <FiEdit size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No matching products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
