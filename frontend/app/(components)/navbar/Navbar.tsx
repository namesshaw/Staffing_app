'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface NavbarProps {
  onSignupClick: () => void;
}

export default function Navbar({ onSignupClick }: NavbarProps) {
  return (
    <motion.nav
      className="flex justify-between items-center p-6 backdrop-blur-xl bg-white/50 shadow-lg sticky top-0 z-50 border-b border-blue-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 80 }}
    >
      <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text animate-pulse">
        StaffingUp
      </Link>
      <div className="flex items-center space-x-6">
        {['Features', 'About', 'Contact'].map((item, idx) => (
          <Link key={idx} href={`#${item.toLowerCase()}`} className="text-blue-600 hover:text-cyan-500 font-semibold">
            {item}
          </Link>
        ))}
        <Link href="/signin" className="text-blue-700 hover:text-cyan-600 font-bold">
          Sign In
        </Link>
        <button
          onClick={onSignupClick}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:shadow-2xl hover:scale-105 transition font-semibold"
        >
          Sign Up
        </button>
      </div>
    </motion.nav>
  );
}
