import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiX, FiLogOut } from "react-icons/fi";

const navItems = [
  { name: "Landing", path: "/dashboard/landing" },
  { name: "Collections", path: "/dashboard/collections" },
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
      <div
        className={`fixed lg:static z-40 top-0 left-0 h-screen w-64 
        bg-white/70 backdrop-blur-md border-r border-gray-200 
        shadow-lg transition-transform duration-300 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col justify-between p-6">
          <div>
            {/* Mobile Close Icon */}
            <div className="flex justify-between items-center lg:hidden mb-4">
              <img src="/Logo.png" alt="Nihonga" className="h-8 w-auto" />
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-red-500 transition"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Brand Logo (Desktop) */}
            <div className="hidden lg:flex justify-center mb-8">
              <img src="/Logo.png" alt="Nihonga" className="h-12 w-auto" />
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-4 rounded-lg text-gray-700 
                    hover:bg-gray-100 hover:scale-[1.02] active:scale-95 
                    transition-all duration-200 ${
                      isActive
                        ? "bg-gray-200 font-semibold shadow-inner"
                        : ""
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
            className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-md 
            hover:bg-red-50 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
