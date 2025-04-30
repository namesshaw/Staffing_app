'use client'
import { useState, KeyboardEvent, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Skill } from "../../../../../backend/src/interfaces"

export default function AddSkills() {
    type SkillInput = Omit<Skill, "developer_id">
    const [skills, setSkills] = useState<SkillInput[]>([])
    const [currentSkill, setCurrentSkill] = useState('')
    const [currentProficiency, setCurrentProficiency] = useState('Beginner')
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const router = useRouter()

    useEffect(() => {
        getSkills()
    }, []) // Remove skills dependency to prevent infinite loop

    const getSkills = async() => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/dev/getskills')
            setSkills(response.data[0].skills)
        } catch(e) {
            console.log(e)
        }
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentSkill.trim() !== '') {
            if (editingIndex !== null) {
                // Update existing skill
                const updatedSkills = [...skills]
                updatedSkills[editingIndex] = {
                    name: currentSkill.trim(),
                    proficiency: currentProficiency
                }
                setSkills(updatedSkills)
                setEditingIndex(null)
            } else {
                // Add new skill
                setSkills([...skills, {
                    name: currentSkill.trim(),
                    proficiency: currentProficiency
                }])
            }
            setCurrentSkill('')
            setCurrentProficiency('Beginner')
        }
    }

    // const editSkill = (index: number) => {
    //     const skillToEdit = skills[index]
    //     setCurrentSkill(skillToEdit.name)
    //     setCurrentProficiency(skillToEdit.proficiency)
    //     setEditingIndex(index)
    // }

    const removeSkill = (indexToRemove: number) => {
        setSkills(skills.filter((_, index) => index !== indexToRemove))
    }

    const handleSubmit = async () => {
        console.log("Inside handlesubmit")
        try {
            debugger
            await axios.put('http://localhost:3000/api/v1/dev/addskills', 
                { skills },
            )
            router.push('dev/addskills') // Or wherever you want to redirect after success
        } catch (error) {
            console.error('Error adding skills:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">
                    {editingIndex !== null ? 'Edit Skill' : 'Add Your Skills'}
                </h1>
                
                <div className="mb-4">
                    <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={editingIndex !== null ? "Edit skill and press Enter" : "Type a skill and press Enter"}
                        className="w-full p-2 border rounded"
                    />
                    <select
                        value={currentProficiency}
                        onChange={(e) => setCurrentProficiency(e.target.value)}
                        className="mt-2 p-2 border rounded"
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {skills.map((skill, index) => (
                        <div 
                            key={index}
                            className={`px-3 py-1 rounded-full flex items-center ${
                                editingIndex === index ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}
                        >
                            <span>{skill.name} - {skill.proficiency}</span>
                            <div className="ml-2 flex gap-1">
                                {/* <button
                                    onClick={() => editSkill(index)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    ✎
                                </button> */}
                                <button
                                    onClick={() => removeSkill(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Save All Skills
                </button>
            </div>
        </div>
    )
}