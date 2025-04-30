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

interface NavbarProps {
  onSignupClick: () => void;
}

export default function Navbar({ onSignupClick }: NavbarProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const islogin = useSelector((state:RootState)=>state.auth.isAuthenticated)
  
  

  async function handlelogout() {
    
    
    dispatch(logout()) 
    const logout1 = await axios.get("http://localhost:3000/api/v1/logout",{
      
        withCredentials: true
      
    })
    router.push("/")
    dispatch(logout())
  }
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
    <motion.nav
      className="flex justify-between items-center p-6 backdrop-blur-xl bg-white/50 shadow-lg sticky top-0 z-50 border-b border-blue-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 80 }}
    >
      {/* Logo */}
      <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text animate-pulse">
        StaffingUp
      </Link>

      {/* Desktop Menu */}
      { !islogin?
      (<div className="hidden md:flex items-center space-x-6">
        {['Features', 'About', 'Contact'].map((item, idx) => (
          <Link 
            key={idx} 
            href={`#${item.toLowerCase()}`} 
            className="text-blue-600 hover:text-cyan-500 font-semibold"
          >
            {item}
          </Link>
        ))}

        
        <Link href="/" className="text-blue-700 hover:text-cyan-600 font-bold"
        onClick={() => {
          console.log('Button clicked');
          openModal();
        }}
        >
          Sign In
        </Link>
        <button
          onClick={onSignupClick}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:shadow-2xl hover:scale-105 transition font-semibold"
        >
          Sign Up
        </button>
      </div>):
      (<div>
        
         <button
         onClick={handlelogout}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md hover:shadow-2xl hover:scale-105 transition font-semibold"
        >
          Logout

        </button>
      </div>)
      }

      {/* Mobile Hamburger Icon */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-3xl text-blue-600">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full flex flex-col items-center bg-white/90 backdrop-blur-lg py-6 gap-6 shadow-lg md:hidden">
          {['Features', 'About', 'Contact'].map((item, idx) => (
            <Link 
              key={idx} 
              href={`#${item.toLowerCase()}`} 
              onClick={() => setIsOpen(false)} 
              className="text-blue-600 hover:text-cyan-500 font-semibold text-lg"
            >
              {item}
            </Link>
          ))}
          <Link 
            href="/" 
            onClick={() => {
              console.log('Button clicked');
              openModal();
            }}
            className="text-blue-700 hover:text-cyan-600 font-bold text-lg"
          >
            Sign In
          </Link>
          <button
            onClick={() => {
              onSignupClick();
              setIsOpen(false);
            }}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:scale-105 transition font-semibold"
          >
            Sign Up
          </button>

        </div>
      )}
    </motion.nav>
    {isModalOpen && (
            <SigninPromptModal isOpen={isModalOpen} closeModal={closeModal} />
          )}
         </>
  );
}
