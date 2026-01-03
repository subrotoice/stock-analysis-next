"use client";

import { useState } from "react";
import Link from "next/link";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Watch List", href: "/watch-list" },
  { label: "Top 15", href: "/top-15" },
  { label: "Visibility", href: "#" },
  { label: "edeves.com", href: "http://edeves.com" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-xl font-bold text-indigo-600">
            <Link href="/">eDeves</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-indigo-600"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-4 pb-4">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block py-2 text-gray-700 hover:text-indigo-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
