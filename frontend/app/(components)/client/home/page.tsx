"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { UserIcon, PlusCircleIcon, FolderIcon, ChevronDown } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <section className="text-center max-w-3xl mx-auto mt-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome, Client 🧑‍💼</h1>
        <p className="text-lg text-gray-300 mb-6">
          Manage your profile, post projects, and track ongoing work with developers.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
        {/* Profile Card */}
        <div
          onClick={() => router.push("/client/yourprofile")}
          className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center hover:shadow-2xl transition cursor-pointer"
        >
          <UserIcon className="w-8 h-8 mx-auto text-blue-400 mb-3" />
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-gray-400">View and manage your personal and company information.</p>
        </div>

        {/* Add Project Card with Dropdown */}
        <div
          ref={dropdownRef}
          className="relative bg-gray-800 border border-gray-700 p-6 rounded-xl text-center hover:shadow-2xl transition cursor-pointer"
        >
          <div
            className="flex flex-col items-center"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <span className="relative">
              <PlusCircleIcon className="w-8 h-8 mx-auto text-green-400 mb-3 transition group-hover:scale-110" />
              <ChevronDown
                className={`absolute -right-6 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
                size={20}
              />
            </span>
            <h2 className="text-xl font-semibold">Add Project</h2>
            <p className="text-sm text-gray-400">Create new projects and define your development needs.</p>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-4 w-56 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl shadow-2xl z-20"
              role="menu"
              aria-label="Add Project Options"
            >
              <button
                className="flex items-center gap-2 w-full text-left px-5 py-3 rounded-t-xl bg-transparent hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition"
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/client/addproject");
                }}
                role="menuitem"
              >
                <PlusCircleIcon className="w-5 h-5 text-green-400" />
                <span>Add Manually</span>
              </button>
              <button
                className="flex items-center gap-2 w-full text-left px-5 py-3 rounded-b-xl bg-transparent hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition"
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/client/ai");
                }}
                role="menuitem"
              >
                <span className=" w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  AI
                </span>
                <span>Use AI</span>
              </button>
            </div>
          )}
        </div>

        {/* My Projects Card */}
        <div
          onClick={() => router.push("/client/yourprojects")}
          className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center hover:shadow-2xl transition cursor-pointer"
        >
          <FolderIcon className="w-8 h-8 mx-auto text-purple-400 mb-3" />
          <h2 className="text-xl font-semibold">My Projects</h2>
          <p className="text-sm text-gray-400">Track progress on current and past projects.</p>
        </div>
      </section>
    </main>
  );
}
