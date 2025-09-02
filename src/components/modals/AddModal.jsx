import React from "react";

export default function AddModal({ open, onClose, onSubmit, title, fields = [] }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative transform scale-95 animate-fadeIn">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
            {title || "Add Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200"
          >
            ×
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
        >
          {fields.map(({ label, name, placeholder, type = "text" }) => (
            <div key={name} className="space-y-1">
              <label className="block text-sm font-medium text-gray-600">{label}</label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                required
              />
            </div>
          ))}

          <div className="pt-2 text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
