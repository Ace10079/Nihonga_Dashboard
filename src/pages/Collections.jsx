import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AddModal from "../components/modals/AddModal";
import EditModal from "../components/modals/EditModal";
import DeleteModal from "../components/modals/DeleteModal";
import {
  BASE_URL, // <-- Export this from api.js
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../services/api";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (err) {
      console.error("Error fetching collections:", err);
      setError("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const payload = new FormData();
      payload.append("name", formData.get("name"));

      const image = formData.get("image");
      if (image && image.size > 0) {
        payload.append("image", image);
      }

      await createCollection(payload);
      fetchCollections();
      setAddOpen(false);
    } catch (err) {
      console.error("Failed to add collection:", err);
      alert("Failed to add collection!");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!currentCollection?._id) return;
    try {
      const formData = new FormData(e.target);
      const payload = new FormData();
      payload.append("name", formData.get("name"));

      const file = formData.get("image");
      if (file && file.size > 0) {
        payload.append("image", file);
      }

      await updateCollection(currentCollection._id, payload);
      fetchCollections();
      setEditOpen(false);
    } catch (err) {
      console.error("Failed to update collection:", err);
      alert("Failed to update collection!");
    }
  };

  const handleDelete = async () => {
    if (!currentCollection?._id) return;
    try {
      // Optimistic UI update
      setCollections(prev => prev.filter(c => c._id !== currentCollection._id));
      await deleteCollection(currentCollection._id);
      setDeleteOpen(false);
    } catch (err) {
      console.error("Failed to delete collection:", err);
      alert("Failed to delete collection!");
      fetchCollections(); // Reload if delete failed
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Collections</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-300"
          onClick={() => setAddOpen(true)}
        >
          ➕ Add Collection
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {/* Collections Grid */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading...</p>
      ) : collections.length === 0 ? (
        <p className="text-gray-600">No collections available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {collections.map((c) => (
              <motion.div
                key={c._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.03 }}
                className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                    onClick={() => {
                      setCurrentCollection(c);
                      setEditOpen(true);
                    }}
                  >
                    <FiEdit className="text-blue-600" />
                  </button>
                  <button
                    className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                    onClick={() => {
                      setCurrentCollection(c);
                      setDeleteOpen(true);
                    }}
                  >
                    <FiTrash2 className="text-red-600" />
                  </button>
                </div>

                {/* Collection Image */}
                <div className="h-44 w-full bg-gray-100">
                  {c.image ? (
                    <img
                      src={`${BASE_URL.replace("/api", "")}${c.image}`}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Collection Name */}
                <div className="p-4 text-center">
                  <h2 className="text-lg font-semibold">{c.name}</h2>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        title="Add Collection"
        backdropClass="backdrop-blur-md bg-black/20"
        fields={[
          { label: "Name", name: "name", placeholder: "Collection name", type: "text" },
          { label: "Image", name: "image", placeholder: "Upload image", type: "file" },
        ]}
      />

      <EditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={currentCollection}
        onSubmit={handleEdit}
        title="Edit Collection"
        backdropClass="backdrop-blur-md bg-black/20"
        fields={[
          { label: "Name", name: "name", placeholder: "Collection name", type: "text" },
          { label: "Image", name: "image", placeholder: "Upload new image", type: "file" },
        ]}
      />

      <DeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        itemName={currentCollection?.name}
        backdropClass="backdrop-blur-md bg-black/20"
        onConfirm={handleDelete}
      />
    </div>
  );
}
