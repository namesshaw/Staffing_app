"use client";

import { useRouter } from "next/navigation";
import { UserIcon, PlusCircleIcon, FolderIcon } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <section className="text-center max-w-3xl mx-auto mt-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome, Client 🧑‍💼</h1>
        <p className="text-lg text-gray-300 mb-6">
          Manage your profile, post projects, and track ongoing work with developers.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
        <div
          onClick={() => router.push("/client/yourprofile")}
          className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center hover:shadow-2xl transition cursor-pointer"
        >
          <UserIcon className="w-8 h-8 mx-auto text-blue-400 mb-3" />
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-gray-400">View and manage your personal and company information.</p>
        </div>

        <div
          onClick={() => router.push("/client/addproject")}
          className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center hover:shadow-2xl transition cursor-pointer"
        >
          <PlusCircleIcon className="w-8 h-8 mx-auto text-green-400 mb-3" />
          <h2 className="text-xl font-semibold">Add Project</h2>
          <p className="text-sm text-gray-400">Create new projects and define your development needs.</p>
        </div>

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
