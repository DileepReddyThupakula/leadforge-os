"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardConfig } from "@/config/dashboard";
import { Icon, IconName } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <aside
      className={cn(
        "relative hidden flex-col border-r border-white/[0.05] bg-card transition-all duration-300 lg:flex",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand Section */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-white/[0.05]">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90",
            isCollapsed && "justify-center w-full"
          )}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <span className="text-sm font-black">LF</span>
          </div>
          {!isCollapsed && <span className="animate-in fade-in-0 duration-300">LeadForge OS</span>}
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1 p-3">
        {dashboardConfig.sidebarNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.title}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-secondary/50",
                isActive ? "bg-secondary text-primary border-l-2 border-primary rounded-l-none" : "text-muted-foreground hover:text-foreground",
                isCollapsed && "justify-center px-2 border-l-0 rounded-lg"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              {item.icon && (
                <Icon
                  name={item.icon as IconName}
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
              )}
              {!isCollapsed && (
                <span className="truncate animate-in fade-in-0 duration-300">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle collapse action */}
      <div className="p-3 border-t border-white/[0.05] flex justify-end">
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Icon
            name={isCollapsed ? "ChevronRight" : "ChevronLeft"}
            className="size-4"
          />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    </aside>
  );
}
