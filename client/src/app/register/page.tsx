"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";

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
      setUser(res.data.user); // your backend must return user in res.data.user
      router.push("/chat");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center px-10 py-16">
        <div className="mb-10 flex items-center gap-3">
          <img src="/symbol.jpg" alt="Logo" className="h-10" />
          <h2 className="text-2xl font-semibold font-mono">ThinkFast AI</h2>
        </div>
        <h1 className="text-3xl font-bold mb-2 font-mono">Create your account</h1>
        <p className="mb-10 font-mono text-white/80 text-lg">and start learning smarter.</p>

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
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-white/10 text-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-2 bg-white text-black py-2 rounded font-bold hover:bg-gray-200 transition"
          >
            Register
          </button>

          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2">
        <img src="/rocketthree.png" alt="Rocket" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
