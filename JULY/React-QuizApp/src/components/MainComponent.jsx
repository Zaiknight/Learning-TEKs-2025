import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

function deleteCookie(cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export default function SidebarLayout({ children }) {
  const location = useLocation();
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  const closeSideMenu = () => setSideMenuOpen(false);

  // Sidebar navigation links
  const navLinks = [
    {
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: "/dashboard",
    },
    {
      label: "To-Do List",
      icon: (
        <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      href: "/to-do-list",
    },
    {
      label: "Quiz Form",
      icon: (
        <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      href: "/quiz_form",
    },
    {
      label: "Users",
      icon: (
        <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      href: "/users",
    },
  ];

  // Helper to determine if a link is active
  const isActive = (href) => location.pathname === href;

  return (
    <div className={`flex bg-gray-50 dark:bg-gray-900 transition-all${isSideMenuOpen ? " overflow-hidden" : ""}`}>
      {/* Desktop sidebar */}
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0 h-screen" >
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <Link
            className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
            to="/"
          >
            Zaiknight
          </Link>
          <ul className="mt-6">
            {navLinks.map((nav) => (
              <li key={nav.label} className="relative px-6 py-3">
                {isActive(nav.href) && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                )}
                <Link
                  className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                    isActive(nav.href)
                      ? "text-gray-800 dark:text-gray-100"
                      : "hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                  to={nav.href}
                  onClick={() => setSideMenuOpen(false)}
                >
                  {nav.icon}
                  <span className="ml-4">{nav.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {/* Mobile sidebar backdrop */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center transition-opacity duration-150"
          onClick={closeSideMenu}
        />
      )}
      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden transition-transform duration-150 ${
          isSideMenuOpen
            ? "transform-none opacity-100"
            : "-translate-x-20 opacity-0 pointer-events-none"
        }`}
        tabIndex={-1}
        onBlur={closeSideMenu}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <Link
            className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
            to="/"
            onClick={closeSideMenu}
          >
            Zaiknight
          </Link>
          <ul className="mt-6">
            {navLinks.map((nav) => (
              <li key={nav.label} className="relative px-6 py-3">
                {isActive(nav.href) && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-700 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                )}
                <Link
                  className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                    isActive(nav.href)
                      ? "text-gray-800 dark:text-gray-100"
                      : "hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                  to={nav.href}
                  onClick={closeSideMenu}
                >
                  {nav.icon}
                  <span className="ml-4">{nav.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex flex-col flex-1 w-full">
        <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
          <div className="container flex items-center justify-between px-6 mx-auto text-purple-600 dark:text-purple-300">
            {/* Mobile hamburger */}
            <button
              className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-purple-400"
              onClick={() => setSideMenuOpen((open) => !open)}
              aria-label="Menu"
              type="button"
            >
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* Search input */}
            <div className="flex justify-center flex-1 lg:mr-32">
              <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
                <div className="absolute inset-y-0 flex items-center pl-2">
                  <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  className="w-full h-8 pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-4xl dark:placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-gray-700 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  type="text"
                  placeholder="Search for projects"
                  aria-label="Search"
                />
              </div>
            </div>
            {/* (Rest of header: notifications, profile, etc.) */}
            <div>
            <Link to="/">
            <button
                className="px-2 py-1 bg-purple-500 text-white rounded  hover:bg-purple-700 active:bg-indigo-500"
                onClick={()=>{
                  deleteCookie("CurrentUser");
                  deleteCookie("CurrentUserName");
                  sessionStorage.setItem('login','false');
                }}
                >
                  Log Out
              </button></Link>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}