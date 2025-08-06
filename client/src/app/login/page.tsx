"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // Added missing import
import axios from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      console.log("✅ Login Response:", res.data);
      router.push("/chat");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex items-center w-full bg-black/98 text-white p-3.5 h-[70px] relative">
        <div className="flex items-center">
          <Image src="/symbol.jpg" alt="Logo" height={70} width={70} className="rounded" />
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
            <Image src="/symbol.jpg" alt="Logo" width={40} height={40} />
            <h2 className="text-2xl font-semibold font-mono">ThinkFast AI</h2>
          </div>
          <h1 className="text-3xl font-bold mb-2 font-mono">Increase your learning curve</h1>
          <p className="mb-10 font-mono text-white/80 text-lg">with ThinkFast AI.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded bg-white/10 text-white focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded bg-white/10 text-white focus:outline-none"
              required
            />
            <button
              type="submit"
              className="mt-2 bg-white text-black py-2 rounded font-bold hover:bg-gray-200 transition"
            >
              Login
            </button>

            <p className="mt-4 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="underline cursor-pointer"
              >
                Register
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