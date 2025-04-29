import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axios from 'axios'

export  async function middleware (request: NextRequest) {
    console.log("Inside frontend middleware")
    const {pathname} = request.nextUrl
    try {
        const respose =  await axios.get("http://localhost:3000/api/v1/verify");
    if(respose.data.message === "Not authorized"){
    return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    else if(respose.data.message === "DEV Verified" && pathname.startsWith("/client")){
    return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
   else if(respose.data.message === "USERUSER Verified" && pathname.startsWith("/dev"))
    { 
    return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
}
export const config = {
    matcher: ['/client/:path*', '/dev/:path*'],
  }