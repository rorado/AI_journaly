// This is a client-side layout for the dashboard section
"use client";

import Loading from "@/app/loading";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { RiMenuUnfold2Line } from "react-icons/ri";
import { RiMenuFold2Line } from "react-icons/ri";

// DashboardLayout provides a responsive sidebar and header for dashboard pages
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // Sidebar menu items
  const menu = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "model", link: "/model" },
    { name: "Settings", link: "/dashboard/settings" },
  ];

  // State to control sidebar collapse (responsive)
  const [isCollapsed, setIsCollapsed] = useState<boolean | null>(true);

  // Collapse sidebar on small screens, expand on large screens
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // Main container: flex layout for sidebar and content
    <div className="w-screen h-screen relative flex overflow-x-hidden">
      {/* Mobile menu button (shows when sidebar is collapsed on mobile) */}
      <div
        className={`fixed top-0.5 left-4 lg:hidden mt-2 w-fit h-fit z-20 ${
          isCollapsed ? "block" : "hidden"
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:scale-105 cursor-pointer"
        >
          {isCollapsed ? (
            <RiMenuUnfold2Line size={24} />
          ) : (
            <RiMenuFold2Line size={24} />
          )}
        </button>
      </div>
      {/* Sidebar navigation */}
      <aside
        className={`z-10 fixed left-0 top-0 h-full duration-500 ease-in-out transition-all  ${
          isCollapsed ? "w-0 lg:w-16" : "w-screen lg:w-64"
        } bg-gray-200`}
      >
        <nav className={`mt-10 text-black`}>
          {/* Sidebar collapse/expand button (hidden on mobile when collapsed) */}
          <div
            className={`justify-end px-4 mb-8 ${
              !isCollapsed ? "block" : "hidden lg:block"
            }`}
          >
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hover:scale-105 cursor-pointer"
            >
              {isCollapsed ? (
                <RiMenuUnfold2Line size={24} />
              ) : (
                <RiMenuFold2Line size={24} />
              )}
            </button>
          </div>
          {/* Sidebar menu links */}
          <ul
            className={`flex flex-col px-4 ${isCollapsed ? "hidden" : "block"}`}
          >
            {menu.map((item) => (
              <Link key={item.link} href={item.link} className="w-full">
                <li className="flex justify-center cursor-pointer hover:bg-gray-300 p-2">
                  {item.name}
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content area, shifts right when sidebar is expanded */}
      <div
        className={`${
          isCollapsed ? "ml-0 lg:ml-16" : "lg:ml-64"
        } h-full w-full px-4`}
      >
        {/* Header with user button */}
        <header className="h-16 flex items-center justify-between">
          <div></div>
          <UserButton />
        </header>
        {/* Render page content */}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
