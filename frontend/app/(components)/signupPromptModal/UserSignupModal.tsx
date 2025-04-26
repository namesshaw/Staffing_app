'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';

interface UserSignupModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function UserSignupModal({ isOpen, closeModal }: UserSignupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('User Form Submitted:', formData);  // For now, just log it
    closeModal();  // Close the modal after submit
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="scale-75 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-75 opacity-0"
          >
            <Dialog.Panel className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-lg space-y-6">
              <motion.h2 
                className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                User Signup
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {['name', 'email', 'company', 'password', 'phone'].map((field) => (
                  <div className="flex flex-col" key={field}>
                    <label className="text-blue-600 font-semibold capitalize">{field}</label>
                    <input
                      name={field}
                      type={field === 'password' ? 'password' : 'text'}
                      required
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-full hover:scale-105 hover:shadow-lg transition"
                >
                  Submit
                </button>
              </form>

              <button
                type="button"
                onClick={closeModal}
                className="text-blue-400 text-sm hover:text-blue-600 text-center w-full"
              >
                Cancel
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
