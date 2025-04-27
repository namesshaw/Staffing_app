'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react'; // using Lucide icons

import Footer from '../../footer/Footer';
import { User } from '../../../../../backend/src/interfaces';



export default function ProfilePage() {
  const [User, setUser] = useState<User>({
    name: 'John Doe',
    company: "xyz",
    email: 'john@example.com',
    phone: '+1234567890',
    password: '********',
    rating: 4.5,
    id: "x"
  });

  const [isEditing, setIsEditing] = useState<keyof User | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
 


  const startEditing = (field: keyof User) => {
    setIsEditing(field);
    setTempValue(User[field].toString());
  };

  const saveEdit = () => {
    if (isEditing) {
      setUser(prev => ({
        ...prev,
        [isEditing]:  isEditing === 'rating' ? Number(tempValue) : tempValue,
      }));
    }
    setIsEditing(null);
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-400 min-h-screen flex flex-col overflow-x-hidden">
      

      {/* Main Content */}
      <main className="flex-grow">
        {/* Profile Section */}
        <section className="relative flex flex-col items-center justify-center text-center py-32 px-4">
          {/* Background Animation */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 to-transparent opacity-70 blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />

          {/* Title */}
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-900 text-transparent bg-clip-text mb-12 drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            User Profile
          </motion.h1>

          {/* Profile Card */}
          <div className="bg-white/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 max-w-3xl w-full text-left space-y-8 border border-white/50">
            {Object.entries(User).map(([key, value], idx) => (
              <motion.div
                key={key}
                className="flex justify-between items-center border-b border-white/30 pb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div>
                  <p className="text-sm text-gray-200 capitalize">{key}</p>
                  <p className="text-2xl font-semibold text-white tracking-wide">
                    {value}
                  </p>
                </div>
                <button
                  onClick={() => startEditing(key as keyof User)}
                  className="p-2 rounded-full hover:bg-white/20 transition-all"
                >
                  <Pencil className="text-white" size={20} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Edit Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 shadow-2xl space-y-6 w-96">
                <h2 className="text-2xl font-bold text-blue-700">Edit {isEditing}</h2>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsEditing(null)}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-900 text-white font-bold hover:scale-105 transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Signup Prompt Modal */}
    </div>
  );
}
