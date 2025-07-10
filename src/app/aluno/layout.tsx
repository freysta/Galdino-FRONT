"use client";

import ModernSidebar from "@/components/ModernSidebar";

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ModernSidebar userType="aluno" />
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
