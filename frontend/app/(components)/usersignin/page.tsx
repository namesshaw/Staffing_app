'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { setAuthCookie } from '../_cookies/cookies'
import Link from 'next/link';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../public/store'
import { login } from '@/public/features/authSlice';

export default function UserSignin() {
  const dispatch = useDispatch()
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const token = useSelector((state : RootState) => state.auth.token)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Developer Signin:', formData);
    try{
        const response = await axios.post(`http://localhost:3000/api/v1/client/signin`, {
           email : formData.email,
           password : formData.password
        },
        {
          withCredentials: true
        }
      );
        if(!response.data){
           console.log("NULL")
            alert("OPOPS")
            return;
        }
        const token = response.data.token
        const role = response.data.role
        localStorage.setItem("token", response.data.token);
        setAuthCookie(response.data.token);
        dispatch(login({token: token,
          isAuthenticated:true,
          email : formData.email,
         username:response.data.username,
         role:role,
         userId : response.data.userId
        }))
        router.push('/client/home')
    }catch(e){
      console.log(e)
      alert("Something went wrong")
    }
  };

  return !token ?(
    <div className="relative bg-gradient-to-br from-blue-100 via-white to-cyan-100 h-screen w-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background Blobs */}
      <motion.div
        className="absolute w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl top-0 left-0 animate-pulse"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-blue-200/30 rounded-full blur-3xl bottom-0 right-0 animate-pulse"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 7 }}
      />

      <motion.div
        className="relative z-10 bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-center mb-6">
          User Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
              className="peer px-4 py-3 w-full rounded-xl border border-blue-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300 outline-none bg-white text-sm shadow-sm placeholder-transparent"
            />
            <label
              className="absolute left-4 top-3 text-blue-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-blue-300 peer-focus:top-0 peer-focus:text-xs peer-focus:text-cyan-400"
            >
              Email
            </label>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
              className="peer px-4 py-3 w-full rounded-xl border border-blue-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300 outline-none bg-white text-sm shadow-sm placeholder-transparent"
            />
            <label
              className="absolute left-4 top-3 text-blue-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-blue-300 peer-focus:top-0 peer-focus:text-xs peer-focus:text-cyan-400"
            >
              Password
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-center text-blue-400 mt-5 text-xs">
          New here?{' '}
          <Link href="/usersignup" className="text-cyan-500 font-semibold hover:underline">
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  )  : router.push('client/home');
}
