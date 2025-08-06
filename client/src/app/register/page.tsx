"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const { setUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", { name, email, password });
      setUser(res.data.user);
      router.push("/chat");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex items-center w-full bg-black/98 text-white p-3.5 h-[70px] relative">
        <div className="flex items-center">
          <Image 
            src="/symbol.jpg" 
            alt="Logo" 
            height={70} 
            width={70} 
            className="rounded"
            priority
          />
          <h2 className="text-xl font-semibold font-mono">ThinkFast AI</h2>
        </div>

        <div className="text-lg flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="hover:text-gray-300 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition">
            About
          </Link>
          <Link href="/chat" className="hover:text-gray-300 transition">
            Chat with AI
          </Link>
          <Link href="/login" className="hover:text-gray-300 transition">
            Login/Register
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-70px)] flex flex-col md:flex-row">
        {/* Left: Form Section */}
        <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center px-10 py-16">
          <div className="mb-10 flex items-center gap-3">
            <Image 
              src="/symbol.jpg" 
              alt="Logo" 
              width={40} 
              height={40} 
              priority
            />
            <h2 className="text-2xl font-semibold font-mono">ThinkFast AI</h2>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 font-mono">Increase your learning curve</h1>
          <p className="mb-10 font-mono text-white/80 text-lg">with ThinkFast AI.</p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-3 rounded bg-white/10 text-white focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded bg-white/10 text-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded bg-white/10 text-white focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="submit"
              className="mt-2 bg-white text-black py-2 rounded font-bold hover:bg-gray-200 transition"
            >
              Register
            </button>

            <p className="mt-4 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="underline cursor-pointer bg-transparent border-none p-0"
              >
                Login
              </button>
            </p>
          </form>
        </div>

        {/* Right: Image Section */}
        <div className="w-full md:w-1/2 relative" style={{ height: "calc(100vh - 70px)" }}>
          <Image
            src="/rocketthree.png"
            alt="Rocket"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}