import React from "react";

export default function AddModal({ open, onClose, onSubmit, title, fields = [] }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">{title || "Add Item"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-lg font-bold">×</button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
        >
          {fields.map(({ label, name, placeholder, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm text-gray-600">{label}</label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
          ))}

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
