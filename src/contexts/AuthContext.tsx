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
  switchProfile: (role: "admin" | "motorista" | "aluno") => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = {
  admin: {
    id: 1,
    name: "Administrador do Sistema",
    email: "admin@galdino.com",
    phone: "(11) 99999-9999",
    role: "admin" as const,
    createdAt: "2024-01-01",
  },
  motorista: {
    id: 2,
    name: "João Silva - Motorista",
    email: "joao.motorista@galdino.com",
    phone: "(11) 98888-8888",
    role: "motorista" as const,
    createdAt: "2024-01-01",
  },
  aluno: {
    id: 3,
    name: "Maria Santos - Aluna",
    email: "maria.aluna@galdino.com",
    phone: "(11) 97777-7777",
    role: "aluno" as const,
    createdAt: "2024-01-01",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUsers.admin);

  const switchProfile = (role: "admin" | "motorista" | "aluno") => {
    setUser(mockUsers[role]);
  };

  const isAuthenticated = true;

  return (
    <AuthContext.Provider value={{ user, switchProfile, isAuthenticated }}>
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
