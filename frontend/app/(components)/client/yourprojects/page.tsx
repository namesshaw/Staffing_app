'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

interface Project {
  id: string
  name: string
  budget: number
  timeline: number
  required_developers: number
  Assigned_developers: Array<{
    name: string
    id: string
  }>
}

export default function YourProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/client/myprojects', {
         
        })
        setProjects(response.data[0].projects)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch projects')
        setLoading(false)
        console.log(err)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{project.name}</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">${project.budget}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timeline:</span>
                    <span className="font-medium">{project.timeline} days</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Required Developers:</span>
                    <span className="font-medium">{project.required_developers}</span>
                  </div>

                  {/* <div className="border-t pt-3 mt-3">
                    <h3 className="text-gray-600 mb-2">Assigned Developers:</h3>
                    {project.Assigned_developers.length > 0 ? (
                      <div className="space-y-1">
                        {project.Assigned_developers.map(dev => (
                          <div key={dev.id} className="text-sm text-gray-800">
                            {dev.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No developers assigned yet</p>
                    )}
                  </div> */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-white">
            <p className="text-xl">You havent created any projects yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}