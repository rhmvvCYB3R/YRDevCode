// src/components/Navbar.js
import Link from "next/link";
import { FaSearch, FaRegUserCircle, FaPlus } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-teal-600 tracking-tight">
          YRDevCode
        </Link>

        <div className="flex items-center space-x-6 text-gray-700 text-xl">
          <Link href="/search" className="hover:text-teal-500">
            <FaSearch />
          </Link>
          <Link href="/create" className="hover:text-teal-500">
            <FaPlus />
          </Link>
          <Link href="/profile" className="hover:text-teal-500">
            <FaRegUserCircle />
          </Link>
        </div>
      </div>
    </nav>
  );
}
