"use client"
import { useRouter } from "next/navigation"
export default function Home(){
    const router = useRouter()
    return(
        <div>Hey 
        <button
        onClick={()=>router.push("/client/yourprofile")}
         className="mr-5 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-800 text-white shadow-md hover:shadow-2xl hover:scale-105 transition font-semibold"
       >
         Profile

       </button>
       <button
        onClick={()=>router.push("/client/addproject")}
         className="mr-5 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-800 text-white shadow-md hover:shadow-2xl hover:scale-105 transition font-semibold"
       >
         Add Project

       </button>
       <button
        onClick={()=>router.push("/client/yourprojects")}
         className="mr-5 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-800 text-white shadow-md hover:shadow-2xl hover:scale-105 transition font-semibold"
       >
         My Project

       </button>
        </div>
        
    )
}