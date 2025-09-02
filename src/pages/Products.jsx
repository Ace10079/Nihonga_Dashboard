import React, { useEffect, useState } from "react";
import {
  BASE_URL, // <-- Add this to your api.js exports
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCollections,
} from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products", err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (err) {
      console.error("Error fetching collections", err);
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const payload = new FormData();
    payload.append("name", formData.get("name"));
    payload.append("description", formData.get("description"));
    payload.append("price", formData.get("price"));
    payload.append("collection", formData.get("collection"));

    const sizesInput = formData.get("sizes");
    if (sizesInput) {
      const sizes = sizesInput.split(",").map((s) => s.trim());
      payload.append("sizes", JSON.stringify(sizes));
    }

    const stock = formData.get("stock");
    if (stock) payload.append("stock", stock);

    const heroImage = formData.get("heroImage");
    if (heroImage && heroImage.size > 0) {
      payload.append("heroImage", heroImage);
    }

    const showcaseInput = e.target.querySelector('input[name="showcaseImages"]');
    if (showcaseInput && showcaseInput.files) {
      Array.from(showcaseInput.files).forEach((file) => {
        if (file && file.size > 0) {
          payload.append("showcaseImages", file);
        }
      });
    }

    try {
      if (type === "add") {
        await createProduct(payload);
        setAddOpen(false);
      } else if (type === "edit" && currentProduct?._id) {
        await updateProduct(currentProduct._id, payload);
        setEditOpen(false);
      }
      fetchProducts();
    } catch (err) {
      console.error("Failed to save product", err);
      alert("Error: " + (err.message || "Failed to save product"));
    }
  };

  const handleDelete = async () => {
    if (!currentProduct?._id) return;
    try {
      setProducts((prev) => prev.filter((p) => p._id !== currentProduct._id)); // Optimistic UI
      await deleteProduct(currentProduct._id);
      setDeleteOpen(false);
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product");
      fetchProducts(); // Restore if failed
    }
  };

  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-300 rounded w-1/4"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const ModalWrapper = ({ open, title, onClose, onSubmit, initialData, fields }) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition"
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
          <form onSubmit={onSubmit} className="space-y-5">
            {fields.map((f, idx) => {
              if (f.type === "textarea")
                return (
                  <div key={idx} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                    <textarea
                      name={f.name}
                      defaultValue={initialData?.[f.name] || ""}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      rows="4"
                    />
                  </div>
                );

              if (f.type === "select")
                return (
                  <div key={idx} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                    <select
                      name={f.name}
                      defaultValue={initialData?.collection?._id || ""}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="">Select Collection</option>
                      {f.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );

              if (f.type === "file")
                return (
                  <div key={idx} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                    <input
                      name={f.name}
                      type="file"
                      multiple={f.multiple}
                      className="w-full border border-gray-300 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                    />
                  </div>
                );

              return (
                <div key={idx} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type}
                    defaultValue={initialData?.[f.name] || ""}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              );
            })}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition shadow-md hover:shadow-lg"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-blue-600 transition shadow-md hover:shadow-lg"
            onClick={() => setAddOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mt-4">No products found</h3>
            <p className="text-gray-500 mt-2">Get started by adding your first product</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              onClick={() => setAddOpen(true)}
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={`${BASE_URL.replace("/api", "")}${product.heroImage}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    {product.collection?.name || "Unassigned"}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                      <p className="text-sm text-gray-500">{product.stock ?? 0} in stock</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                        onClick={() => {
                          setCurrentProduct(product);
                          setEditOpen(true);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                        onClick={() => {
                          setCurrentProduct(product);
                          setDeleteOpen(true);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        <ModalWrapper
          open={addOpen}
          title="Add Product"
          onClose={() => setAddOpen(false)}
          onSubmit={(e) => handleSubmit(e, "add")}
          fields={[
            { label: "Name", name: "name", type: "text" },
            { label: "Description", name: "description", type: "textarea" },
            { label: "Price", name: "price", type: "number" },
            { label: "Sizes", name: "sizes", type: "text", placeholder: "Comma-separated (S,M,L)" },
            { label: "Hero Image", name: "heroImage", type: "file" },
            { label: "Showcase Images", name: "showcaseImages", type: "file", multiple: true },
            {
              label: "Collection",
              name: "collection",
              type: "select",
              options: collections.map((c) => ({ label: c.name, value: c._id })),
            },
          ]}
        />

        {/* Edit Modal */}
        <ModalWrapper
          open={editOpen}
          title="Edit Product"
          onClose={() => setEditOpen(false)}
          onSubmit={(e) => handleSubmit(e, "edit")}
          initialData={currentProduct}
          fields={[
            { label: "Name", name: "name", type: "text" },
            { label: "Description", name: "description", type: "textarea" },
            { label: "Price", name: "price", type: "number" },
            { label: "Stock", name: "stock", type: "number" },
            { label: "Sizes", name: "sizes", type: "text" },
            { label: "Hero Image", name: "heroImage", type: "file" },
            { label: "Showcase Images", name: "showcaseImages", type: "file", multiple: true },
            {
              label: "Collection",
              name: "collection",
              type: "select",
              options: collections.map((c) => ({ label: c.name, value: c._id })),
            },
          ]}
        />

        {/* Delete Modal */}
        {deleteOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Delete "{currentProduct?.name}"?
              </h2>
              <p className="mb-5 text-gray-600">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setDeleteOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
