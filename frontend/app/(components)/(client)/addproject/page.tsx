'use client'
// import { Project } from "../../../../../backend/src/interfaces"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function AddProject() {
    const router = useRouter()
    const [projectData, setProjectData] = useState({
        name: "",
        budget: 0,
        timeline: 0,
        required_developers: 0
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
        
            const response = await axios.post(
                'http://localhost:3000/api/v1/client/addproject',
                projectData,
            )
            if (response.status === 200) {
                router.push('/clienthome')
            }
        } catch (err) {
            setError("Failed to create project. Please try again.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Create New Project
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div >
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={projectData.name}
                            onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                            Budget (in USD)
                        </label>
                        <input
                            type="number"
                            id="budget"
                            required
                            min="0"
                            step="10"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={projectData.budget}
                            onChange={(e) => setProjectData({ ...projectData, budget: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                            Timeline (in days)
                        </label>
                        <input
                            type="number"
                            id="timeline"
                            required
                            min="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={projectData.timeline}
                            onChange={(e) => setProjectData({ ...projectData, timeline: parseInt(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label htmlFor="developers" className="block text-sm font-medium text-gray-700">
                            Required Developers
                        </label>
                        <input
                            type="number"
                            id="developers"
                            required
                            min="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={projectData.required_developers}
                            onChange={(e) => setProjectData({ ...projectData, required_developers: parseInt(e.target.value) })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating Project...' : 'Create Project'}
                    </button>
                </form>
            </div>
        </div>
    )
}