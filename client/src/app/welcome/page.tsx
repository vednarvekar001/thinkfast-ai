'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await fetch('http://localhost:8114/api/user/settings', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) setName(data.user.fullName || '');
        else router.push('/login');
      } catch {
        router.push('/login');
      }
    };

    fetchName();

    const timer = setTimeout(() => {
      router.push('/chat');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white relative overflow-hidden">
      {/* Animated rings */}
      <div className="absolute w-full h-full flex justify-center items-center animate-pulse">
        <div className="w-64 h-64 border-8 border-blue-500 rounded-full opacity-30 animate-ping" />
        <div className="absolute w-64 h-64 border-8 border-purple-500 rounded-full opacity-50 animate-pulse" />
      </div>

      <div className="z-10 text-4xl font-bold font-mono">Welcome, {name || '...'} 🚀</div>
    </div>
  );
}
