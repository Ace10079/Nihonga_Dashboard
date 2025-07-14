import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Hamburger */}
        <div className="lg:hidden p-4 shadow-md bg-white">
          <button onClick={() => setSidebarOpen(true)}>
            <FiMenu size={24} />
          </button>
        </div>

        {/* Page Content (Scrollable only this section) */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
