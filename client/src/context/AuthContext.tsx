"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios"; // We'll set this up next

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await axios.get("/user/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    await axios.post("/auth/logout");
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
};
