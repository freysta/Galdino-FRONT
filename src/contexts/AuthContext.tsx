"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "motorista" | "aluno";
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: "Administrador",
    email: "admin@galdino.com",
    phone: "(11) 99999-9999",
    role: "admin",
    createdAt: "2024-01-01",
  });

  const login = async (email: string, password: string) => {
    // Simular login
    console.log("Login attempt with:", email, password);
    setUser({
      id: 1,
      name: "Administrador",
      email: email,
      phone: "(11) 99999-9999",
      role: "admin",
      createdAt: "2024-01-01",
    });
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
