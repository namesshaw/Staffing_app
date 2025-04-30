"use client"

import { useRouter } from "next/navigation"
import { RocketIcon, UserIcon, MessageSquareIcon } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <section className="text-center max-w-3xl mx-auto mt-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome, Developer 👨‍💻</h1>
        <p className="text-lg text-gray-300 mb-6">
          Manage your profile, explore projects, and collaborate with your team.
        </p>
        <button
          onClick={() => router.push("/dev/myprofile")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition transform hover:scale-105"
        >
          Go to Profile
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center hover:shadow-2xl transition">
          <RocketIcon className="w-8 h-8 mx-auto text-blue-400 mb-3" />
          <h2 className="text-xl font-semibold">Projects</h2>
          <p className="text-sm text-gray-400">Discover and contribute to exciting development projects.</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center hover:shadow-2xl transition">
          <MessageSquareIcon className="w-8 h-8 mx-auto text-green-400 mb-3" />
          <h2 className="text-xl font-semibold">Chatrooms</h2>
          <p className="text-sm text-gray-400">Communicate and collaborate with your team in real-time.</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center hover:shadow-2xl transition">
          <UserIcon className="w-8 h-8 mx-auto text-purple-400 mb-3" />
          <h2 className="text-xl font-semibold">Skills</h2>
          <p className="text-sm text-gray-400">Showcase your skills to match with the best-fit projects.</p>
        </div>
      </section>
    </main>
  )
}
