import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiX, FiLogOut } from "react-icons/fi";

const navItems = [
  { name: "Landing", path: "/dashboard/landing" },
  { name: "Products", path: "/dashboard/products" },
  { name: "Admin", path: "/dashboard/admin" },
  { name: "Stock", path: "/dashboard/stock" },
  { name: "Orders", path: "/dashboard/orders" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed lg:static z-40 top-0 left-0 h-screen w-64 bg-gray-100 border-r transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col justify-between p-6">
          <div>
            {/* Mobile Close Icon */}
            <div className="flex justify-between items-center lg:hidden mb-4">
              <h2 className="text-xl font-bold">Nihonga</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-700">
                <FiX size={22} />
              </button>
            </div>

            {/* Brand Title (Desktop) */}
            <h2 className="hidden lg:block text-2xl font-bold text-gray-800 mb-8 text-center">
              Nihonga
            </h2>

            <nav className="space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-200 transition ${
                      isActive ? "bg-gray-300 font-medium" : ""
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
