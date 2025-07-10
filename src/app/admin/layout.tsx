"use client";

import ModernSidebar from "@/components/ModernSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ModernSidebar userType="admin" />
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
