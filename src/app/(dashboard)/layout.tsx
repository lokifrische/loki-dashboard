"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CommandPalette } from "@/components/layout/command-palette";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <CommandPalette />
      <div className="md:pl-[240px] transition-all duration-200">
        <Header />
        <main className="p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
