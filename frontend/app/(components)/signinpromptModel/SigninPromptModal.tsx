'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SignupPromptModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function SigninPromptModal({ isOpen, closeModal }: SignupPromptModalProps) {
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

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
          <div className="p-6 w-full max-w-md">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="scale-75 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-75 opacity-0"
            >
              <Dialog.Panel className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6">
                <motion.h2
                  className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Choose your path
                </motion.h2>

                <motion.div
                  className="flex flex-col space-y-4 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/devsignin"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-full hover:scale-105 hover:shadow-lg transition"
                  >
                    I am a Developer
                  </Link>
                  <Link
                    href="/usersignin"
                    className="w-full py-3 border-2 border-blue-400 text-blue-600 font-semibold rounded-full hover:scale-105 hover:bg-blue-50 transition"
                  >
                    I am a User
                  </Link>
                </motion.div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-blue-400 text-sm hover:text-blue-600"
                >
                  Cancel
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}