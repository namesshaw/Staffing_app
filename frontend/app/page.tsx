import LandingPage from './(components)/landing/landing';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const verifyAuth = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }
    // Server-side fetch call
    const response = await fetch("http:localhost:3000/api/v1/verify", {
      headers: {
        
        Authorization: token,
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Disable cache for authentication checks
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
};

export default async function Home() {
  const auth = await verifyAuth();

  if (auth?.message === "USER Verified") {
    
    console.log("inside user")
    redirect('/client/home');
  }
  
  if (auth?.message === "DEV Verified") {
    console.log("inside developer")
    redirect('/dev/home');
  }

  return (
    <main>
      <LandingPage/>
    </main>
  );
}
