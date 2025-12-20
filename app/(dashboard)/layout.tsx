"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { RiMenuUnfold2Line } from "react-icons/ri";
import { RiMenuFold2Line } from "react-icons/ri";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const menu = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Journaly", link: "/dashboard/journaly" },
    { name: "Settings", link: "/dashboard/settings" },
  ];

  const [isCollapsed, setIsCollapsed] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isCollapsed === null) {
    return (
      <div className="w-screen h-screen spinner flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-5 border-gray-800"></div>
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen relative overflow-hidden flex">
        <div className="fixed top-0.5 left-4 lg:hidden mt-2 w-fit h-fit z-20">
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
        <aside
          className={`overflow-hidden z-10 absolute left-0 top-0 h-full duration-500 ease-in-out transition-all  ${
            isCollapsed ? "w-0 lg:w-16" : "w-screen lg:w-64"
          } bg-gray-200 `}
        >
          <nav className={`mt-10 text-black`}>
            <div className="flex justify-end px-4 mb-8">
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
            <ul
              className={`flex flex-col px-4 ${
                isCollapsed ? "hidden" : "block"
              }`}
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

        <div
          className={`${
            isCollapsed ? "ml-0 lg:ml-16" : "lg:ml-64 "
          } h-full w-full px-4`}
        >
          <header className="h-16 flex items-center shadow-md justify-between ">
            <div></div>
            <UserButton />
          </header>
          {children}
        </div>
      </div>
    );
  }
};

export default DashboardLayout;
