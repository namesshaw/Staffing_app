'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import SigninPromptModal from '../signinpromptModel/SigninPromptModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/public/store';
import { logout } from '@/public/features/authSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();
interface NavbarProps {
  onSignupClick: () => void;
}

export default function Navbar({ onSignupClick }: NavbarProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const role = useSelector((state: RootState) => state.auth.role);
  // console.log(role)
  const islogin = useSelector((state: RootState) => state.auth.isAuthenticated);
  async function handlelogout() {
    dispatch(logout());
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      withCredentials: true
    });
    router.push("/");
    dispatch(logout());
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <motion.nav
        className="flex justify-between items-center p-6 bg-gradient-to-br from-gray-900 to-gray-800/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        {/* Logo {`${role}/home`}*/ }
        <Link href="home" className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text animate-pulse">
          StaffingUp
        </Link>

        {/* Desktop Menu */}
        {!islogin ? (
          <div className="hidden md:flex items-center space-x-6">
            {['Features', 'About', 'Contact'].map((item, idx) => (
              <Link
                key={idx}
                href={`#${item.toLowerCase()}`}
                className="text-white hover:text-cyan-400 font-semibold"
              >
                {item}
              </Link>
            ))}

            <button
              onClick={openModal}
              className="text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Sign In
            </button>
            <button
              onClick={onSignupClick}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:shadow-2xl hover:scale-105 transition font-semibold"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={handlelogout}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md hover:shadow-2xl hover:scale-105 transition font-semibold"
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-3xl text-cyan-400">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800/90 backdrop-blur-md py-6 gap-6 shadow-lg md:hidden z-50">
          {['Features', 'About', 'Contact'].map((item, idx) => (
            <Link 
              key={idx}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-cyan-400 font-semibold text-lg"
            >
              {item}
            </Link>
          ))}
          {!islogin && 
          (<div>
            <button
              onClick={() => {
                openModal();
                setIsOpen(false);
              }}
              className="text-cyan-400 hover:text-cyan-300 font-bold text-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onSignupClick();
                setIsOpen(false);
              }}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:scale-105 transition font-semibold"
            >
              Sign Up
            </button>
          </div>)}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <SigninPromptModal isOpen={isModalOpen} closeModal={closeModal} />
      )}
    </>
  );
}
