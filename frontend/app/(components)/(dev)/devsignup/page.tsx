'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthCookie } from '../../_cookies/cookies'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/public/features/authSlice';
import {Developer} from "../../../../../backend/src/interfaces"
import { RootState } from '../../../../public/store'
export default function DeveloperSignup() {
  const dispatch = useDispatch()
    const router = useRouter();
    const token = useSelector((state : RootState) => state.auth.token)
  const [formData, setFormData] = useState<Omit<Developer,"id">>({
    name: '',
    YOE: 0,
    email: '',
    phone: '',
    password: '',
    rating: 0
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    console.log('Developer Signin:', formData);
    try{
        const response = await axios.post(`http://localhost:3000/api/v1/dev/signup`, {
          name: formData.name,
          YOE: Number(formData.YOE),
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        if(!response.data){
           console.log("NULL")
            alert("OOPPS")
            return;
        }
        const token = response.data.token
        localStorage.setItem("token", response.data.token);
        setAuthCookie(response.data.token);
        dispatch(login({token: token,
          isAuthenticated:true,
         username:formData.email
        }))
        setSubmitted(true)
        router.push('/home')
    }catch(e){
      console.log(e)
      alert("Something went wrong")
    }
  };

  return !token ?  (
    <div className="relative bg-gradient-to-br from-blue-100 via-white to-cyan-100 h-screen w-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background animated blobs */}
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
        className="relative z-10 bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md md:max-w-sm overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Subtle Gradient Border */}
        <div className="absolute inset-0 rounded-3xl p-1 bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 blur-lg opacity-10 animate-pulse z-0"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-center mb-6">
            Developer Signup
          </h1>

          <AnimatePresence>
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-green-500 font-semibold mb-6 text-lg"
              >
                🚀 Successfully Registered!
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {['name', 'YOE', 'email', 'phone', 'password'].map((field, idx) => (
                  <div key={idx} className="relative">
                    <input
                      type={field === 'password' ? 'password' : field === 'email' ? 'email' : field === 'phone' ? 'tel' : field === 'YOE' ? 'number' : 'text'}
                      name={field}
                      placeholder=" "
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      required={['name', 'email', 'phone', 'password'].includes(field)}
                      className="peer px-4 py-3 rounded-xl w-full border border-blue-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300 outline-none bg-white text-sm shadow-sm placeholder-transparent"
                      step={field === 'YOE' ? "0.1" : undefined}
                      min={field === 'YOE' ? "0" : undefined}
                    />
                    <label
                      className="absolute left-4 top-3 text-blue-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-blue-300 peer-focus:top-0 peer-focus:text-xs peer-focus:text-cyan-400"
                      htmlFor={field}
                    >
                      {field === 'YOE' ? 'Years of Experience' : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-sm"
                >
                  Register
                </motion.button>
              </form>
            )}
          </AnimatePresence>

          <p className="text-center text-blue-400 mt-5 text-xs">
            Already have an account?{' '}
            <Link href="/devsignin" className="text-cyan-500 font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  ) : router.push('/home')
}
