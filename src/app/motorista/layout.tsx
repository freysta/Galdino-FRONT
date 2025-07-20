"use client";

import ModernSidebar from "@/components/ModernSidebar";

export default function MotoristaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ModernSidebar />
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
