import React, { useState, useMemo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import AddModal from "../components/modals/AddModal";
import EditModal from "../components/modals/EditModal";
import DeleteModal from "../components/modals/DeleteModal";

const initialProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: i % 2 === 0 ? "Clothing" : "Footwear",
  price: (Math.random() * 100 + 20).toFixed(2),
  stock: i % 3 === 0 ? 0 : Math.floor(Math.random() * 50 + 1),
  image: `https://source.unsplash.com/160x160/?product,${i}`,
  status: i % 3 === 0 ? "Out of Stock" : "In Stock",
  date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0]
}));

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);

  const productsPerPage = 5;
  const filteredProducts = useMemo(() =>
    products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    ), [products, search]
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">🛍️ Products</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category"
            className="w-full sm:w-auto border border-gray-300 px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-full sm:w-auto transition"
            onClick={() => setAddOpen(true)}
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="w-full overflow-x-auto"
      >
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left text-xs sm:text-sm font-semibold text-gray-600">
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date Added</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((product) => (
              <tr key={product.id} className="border-t text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200">
                <td className="py-2 px-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded shadow-md"
                  />
                </td>
                <td className="py-2 px-4 font-medium">{product.name}</td>
                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4 font-semibold text-blue-600">${product.price}</td>
                <td className="py-2 px-4">{product.stock}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                      product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="py-2 px-4">{product.date}</td>
                <td className="py-2 px-4 flex gap-2 items-center">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition"
                    onClick={() => {
                      setCurrentEdit(product);
                      setEditOpen(true);
                    }}
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition"
                    onClick={() => {
                      setCurrentEdit(product);
                      setDeleteOpen(true);
                    }}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <div className="flex justify-center items-center gap-4 pt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
        >
          ⬅ Prev
        </button>
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
        >
          Next ➡
        </button>
      </div>

      <AddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(e) => {
          const data = Object.fromEntries(new FormData(e.target));
          const newProduct = {
            id: Date.now(),
            ...data,
            price: parseFloat(data.price),
            stock: parseInt(data.stock),
            status: parseInt(data.stock) > 0 ? "In Stock" : "Out of Stock",
            date: new Date().toISOString().split("T")[0]
          };
          setProducts([...products, newProduct]);
          setAddOpen(false);
        }}
        title="Add Product"
        fields={[
          { label: "Name", name: "name", placeholder: "Product name" },
          { label: "Category", name: "category", placeholder: "Category" },
          { label: "Price", name: "price", placeholder: "0.00" },
          { label: "Stock", name: "stock", placeholder: "Quantity" },
          { label: "Image URL", name: "image", placeholder: "https://..." },
        ]}
      />

      <EditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={currentEdit}
        onSubmit={(e) => {
          const data = Object.fromEntries(new FormData(e.target));
          const updatedProduct = {
            ...currentEdit,
            ...data,
            price: parseFloat(data.price),
            stock: parseInt(data.stock),
            status: parseInt(data.stock) > 0 ? "In Stock" : "Out of Stock"
          };
          setProducts(products.map((p) => (p.id === currentEdit.id ? updatedProduct : p)));
          setEditOpen(false);
        }}
        title="Edit Product"
        fields={[
          { label: "Name", name: "name", placeholder: "Product name" },
          { label: "Category", name: "category", placeholder: "Category" },
          { label: "Price", name: "price", placeholder: "0.00" },
          { label: "Stock", name: "stock", placeholder: "Quantity" },
          { label: "Image URL", name: "image", placeholder: "https://..." },
        ]}
      />

      <DeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        itemName={currentEdit?.name || "this product"}
        onConfirm={() => {
          setProducts(products.filter((p) => p.id !== currentEdit.id));
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
