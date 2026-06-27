import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Collapsible Left Navigation Sidebar (Desktop-only, responsive drawer built-in) */}
      <Sidebar />

      {/* Right viewport container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <DashboardNavbar />

        {/* Dynamic content scroll container */}
        <main className="flex-1 overflow-y-auto bg-background/95">
          {children}
        </main>
      </div>
    </div>
  );
}
