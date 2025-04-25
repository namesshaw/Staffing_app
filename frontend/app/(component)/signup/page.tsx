"use client";
import Link from 'next/link'
import axios from 'axios'
import {useState} from 'react';

// import type { RootState } from '../../../public/store'
// import { useSelector, useDispatch } from 'react-redux'
// import { useRouter } from "next/navigation";
// import { login } from '../../../public/features/auth/authSlice'
export default  function Signup(){
  // axios.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem('token')}`;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    // const router = useRouter();
    // const token = useSelector((state : RootState) => state.auth.token)
    // const dispatch = useDispatch();

    const handleSignup = async() => {
        try{
          
          axios.post('http://localhost/api/v1/admin/signup', {
            username : username, 
            password : password,
            email : email
        }).then((response) => {
          console.log(response);
          const data = response.data
        if(response.status === 200){
                  dispatch(login({
                    username : username, 
                    isAuthenticated : true,
                    token : token
                  }))            
                  console.log("token")
            // router.push("/landing");
            window.location.href = "/landing";
        }else {
          alert(data.message);
        }
        })
        
        
        }catch(e){
            console.error("ERROR",  e)
            alert("Signup failed")
        }
    }
    
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50">
        {/* Background patterns */}
        <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.015] pointer-events-none"></div>
        <div className="fixed inset-0 bg-[url('/architectural-pattern.svg')] bg-cover opacity-[0.03]"></div>
  
        <div className="flex items-center justify-center min-h-screen relative z-10 px-6">
          <div className="bg-white/80 backdrop-blur-lg p-12 rounded-3xl shadow-2xl w-full max-w-md border border-stone-200 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-stone-400/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold text-stone-800 text-center mb-2">
                Sign Up
              </h2>
              <p className="text-stone-600 text-center mb-8">Join ArchiStudio today</p>
  
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label className="block text-stone-700 text-sm font-medium mb-2">Username</label>
                  <input id = "signip"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
                    placeholder="Enter your username"
                  />
                </div>
  
                <div>
                  <label className="block text-stone-700 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
                    placeholder="Enter your email"
                  />
                </div>
  
                <div>
                  <label className="block text-stone-700 text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
                    placeholder="Create a password"
                  />
                </div>
  
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-medium shadow-xl hover:shadow-amber-200/50 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Create Account
                </button>
              </form>
  
              <p className="mt-8 text-center text-stone-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-amber-600 hover:text-amber-700 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}