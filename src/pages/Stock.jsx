import React, { useState, useEffect } from 'react';
import { FiEdit, FiRefreshCw, FiPieChart, FiX, FiCheck } from 'react-icons/fi';
import { stockAPI, BASE_URL } from '../services/api';


export default function Stock() {
  const [stockData, setStockData] = useState([]);
  const [filteredStock, setFilteredStock] = useState([]);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [newQty, setNewQty] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError('');
      const [stock, summaryData] = await Promise.all([
        stockAPI.getStock(),
        stockAPI.getSummary()
      ]);
      setStockData(stock);
      setSummary(summaryData);
      setFilteredStock(stock);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  useEffect(() => {
    let data = [...stockData];
    if (search) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter === 'inStock') {
      data = data.filter(item => item.stock > (item.lowStockThreshold || 10));
    } else if (filter === 'lowStock') {
      data = data.filter(item =>
        item.stock > 0 && item.stock <= (item.lowStockThreshold || 10)
      );
    } else if (filter === 'outOfStock') {
      data = data.filter(item => item.stock === 0);
    }
    setFilteredStock(data);
  }, [search, filter, stockData]);

  const updateStock = async (id, qty) => {
    try {
      const updatedProduct = await stockAPI.updateStock(id, parseInt(qty));
      setStockData(prev =>
        prev.map(item => (item._id === id ? updatedProduct : item))
      );
      setEditing(null);
      setNewQty('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <h1 className="text-2xl font-bold text-gray-800">📦 Stock Management</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-lg h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">📦 Stock Management</h1>
          <p className="text-gray-600 text-xs md:text-base">Manage product inventory and stock levels</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border px-4 py-2 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={fetchStockData}
              className="flex items-center justify-center gap-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              aria-label="Refresh data"
            >
              <FiRefreshCw size={16} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              aria-label="Show filters"
            >
              <FiPieChart size={16} />
            </button>
          </div>
          
          {/* Mobile filter dropdown */}
          {showFilters && (
            <div className="md:hidden grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg">
              {[
                { key: 'all', label: 'All', color: 'blue' },
                { key: 'inStock', label: 'In Stock', color: 'green' },
                { key: 'lowStock', label: 'Low Stock', color: 'yellow' },
                { key: 'outOfStock', label: 'Out of Stock', color: 'red' }
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => {
                    setFilter(key);
                    setShowFilters(false);
                  }}
                  className={`p-2 rounded text-xs font-medium ${
                    filter === key 
                      ? `bg-${color}-500 text-white` 
                      : `bg-white text-gray-700`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards - Hidden on mobile when filters are shown */}
      {summary && !showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {[
            { key: 'all', label: 'Total Products', value: summary.totalProducts, color: 'blue' },
            { key: 'inStock', label: 'In Stock', value: summary.inStock, color: 'green' },
            { key: 'lowStock', label: 'Low Stock', value: summary.lowStock, color: 'yellow' },
            { key: 'outOfStock', label: 'Out of Stock', value: summary.outOfStock, color: 'red' }
          ].map(({ key, label, value, color }) => (
            <div
              key={key}
              onClick={() => setFilter(key)}
              className={`cursor-pointer bg-white p-3 md:p-4 rounded-lg shadow border-l-4 border-${color}-500 transition-transform active:scale-95 ${
                filter === key ? `ring-2 ring-${color}-400` : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-medium text-gray-600">{label}</h3>
                <FiPieChart className={`text-${color}-500 text-sm`} />
              </div>
              <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Stock List */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm text-gray-800">
            <thead>
              <tr className="bg-blue-50 text-gray-700">
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Collection</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map(item => (
                <tr
                  key={item._id}
                  className={`border-t hover:bg-gray-50 transition-all duration-200 ${
                    editing === item._id ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {item.heroImage && (
                        <img
                        src={`${BASE_URL.replace('/api', '')}${item.heroImage}`}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">₹{item.price}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{item.collection?.name || 'Unassigned'}</td>
                  <td className="py-3 px-4 font-mono">{item.stock}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.stock === 0
                        ? 'bg-red-100 text-red-600'
                        : item.stock <= (item.lowStockThreshold || 10)
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {item.stock === 0
                        ? 'Out of Stock'
                        : item.stock <= (item.lowStockThreshold || 10)
                        ? 'Low Stock'
                        : 'In Stock'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {editing === item._id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateStock(item._id, newQty);
                        }}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="number"
                          value={newQty}
                          onChange={(e) => setNewQty(e.target.value)}
                          min="0"
                          className="border px-2 py-1 rounded text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white text-xs p-1 rounded hover:bg-blue-700 transition-all"
                          aria-label="Save"
                        >
                          <FiCheck size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="bg-gray-200 text-gray-700 text-xs p-1 rounded hover:bg-gray-300 transition-all"
                          aria-label="Cancel"
                        >
                          <FiX size={14} />
                        </button>
                      </form>
                    ) : (
                      <button
                        className="text-blue-600 hover:text-blue-800 transition"
                        onClick={() => {
                          setEditing(item._id);
                          setNewQty(item.stock);
                        }}
                        aria-label="Edit stock"
                      >
                        <FiEdit size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredStock.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    {search || filter !== 'all'
                      ? 'No matching products found.'
                      : 'No products available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Improved */}
        <div className="md:hidden divide-y">
          {filteredStock.length > 0 ? (
            filteredStock.map(item => (
              <div key={item._id} className="p-3 flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  {item.heroImage && (
                    <img
                    src={`${BASE_URL.replace('/api', '')}${item.heroImage}`}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-xs text-gray-500">₹{item.price}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.collection?.name || 'Unassigned'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-mono">{item.stock} in stock</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
                      item.stock === 0
                        ? 'bg-red-100 text-red-600'
                        : item.stock <= (item.lowStockThreshold || 10)
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {item.stock === 0
                        ? 'Out of Stock'
                        : item.stock <= (item.lowStockThreshold || 10)
                        ? 'Low Stock'
                        : 'In Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end pt-1">
                  {editing === item._id ? (
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-xs text-gray-600 whitespace-nowrap">Update quantity:</span>
                      <input
                        type="number"
                        value={newQty}
                        onChange={(e) => setNewQty(e.target.value)}
                        min="0"
                        className="border px-2 py-1 rounded text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        onClick={() => updateStock(item._id, newQty)}
                        className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-all"
                        aria-label="Save"
                      >
                        <FiCheck size={14} />
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 transition-all"
                        aria-label="Cancel"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-blue-600 hover:text-blue-800 transition text-sm flex items-center gap-1"
                      onClick={() => {
                        setEditing(item._id);
                        setNewQty(item.stock);
                      }}
                    >
                      <FiEdit size={16} />
                      <span className="text-xs">Edit Stock</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              {search || filter !== 'all'
                ? 'No matching products found.'
                : 'No products available.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}