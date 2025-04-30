'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

// Update the Skill interface
interface Skill {
    name: string;
    proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export default function AddProject() {
    const router = useRouter()
    const [projectData, setProjectData] = useState({
        name: "",
        budget: 0,
        timeline: 0,
        required_developers: 0,
        skills: [] as Skill[]  // Add skills array
    })
    // Update initial state with string proficiency
    const [currentSkill, setCurrentSkill] = useState<Skill>({
        name: "",
        proficiency: "Beginner"
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Add skill handler
    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentSkill.name) {
            setProjectData({
                ...projectData,
                skills: [...projectData.skills, currentSkill]
            });
            setCurrentSkill({ name: "", proficiency: "Beginner" }); // Reset current skill
        }
    };

    // Remove skill handler
    const handleRemoveSkill = (index: number) => {
        setProjectData({
            ...projectData,
            skills: projectData.skills.filter((_, i) => i !== index)
        });
    };

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
                router.push('/client/home')
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

                    {/* Add Skills Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Required Skills</h3>
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Skill name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={currentSkill.name}
                                    onChange={(e) => setCurrentSkill({
                                        ...currentSkill,
                                        name: e.target.value
                                    })}
                                />
                            </div>
                            <div className="w-32">
                                <select
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={currentSkill.proficiency}
                                    onChange={(e) => setCurrentSkill({
                                        ...currentSkill,
                                        proficiency: e.target.value as Skill["proficiency"]
                                    })}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Add
                            </button>
                        </div>

                        {/* Skills List */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {projectData.skills.map((skill, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium truncate block">{skill.name}</span>
                                            <span className="text-sm text-gray-500">
                                                {skill.proficiency}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(index)}
                                            className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
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