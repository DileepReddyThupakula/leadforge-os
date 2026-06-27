"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardConfig } from "@/config/dashboard";
import { siteConfig } from "@/config/site";
import { Icon, IconName } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

export function DashboardNavbar() {
  const pathname = usePathname();
  const mounted = useMounted();

  // Simple path segment parser for breadcrumbs
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const title = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { title, href, isLast: index === pathSegments.length - 1 };
  });

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-white/[0.05] bg-background/80 px-4 backdrop-blur-md">
      {/* Left side: Mobile navigation and Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar sheet */}
        {mounted && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="lg:hidden text-muted-foreground">
                <Icon name="Menu" className="size-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="border-r border-white/[0.05] bg-card p-0 w-72">
              <SheetHeader className="p-4 border-b border-white/[0.05]">
                <SheetTitle className="text-left font-bold text-foreground flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-sm font-black">LF</span>
                  </div>
                  <span>{siteConfig.name}</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="space-y-1 p-3">
                {dashboardConfig.sidebarNav.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.title}
                      href={item.disabled ? "#" : item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-secondary/50",
                        isActive ? "bg-secondary text-primary border-l-2 border-primary rounded-l-none" : "text-muted-foreground hover:text-foreground"
                      )}
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
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        )}

        {/* Breadcrumbs - Desktop-only */}
        <nav className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/dashboard" className="transition-colors hover:text-foreground">
            Home
          </Link>
          {breadcrumbItems.map((item) => (
            <div key={item.href} className="flex items-center gap-1.5">
              <span>/</span>
              {item.isLast ? (
                <span className="text-foreground">{item.title}</span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right side: Alert triggers, notifications and user profile */}
      <div className="flex items-center gap-4">
        {/* Workspace Quick-Indicator */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-white/[0.04] bg-secondary/40 px-2.5 py-1 text-xs text-muted-foreground sm:flex">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>Production Workspace</span>
        </div>

        {/* Notifications Icon (Placeholder for architecture) */}
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground relative">
          <Icon name="Bell" className="size-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User profile dropdown */}
        <OrganizationSwitcher
          hidePersonal={true}
          appearance={{
            variables: {
              colorPrimary: "oklch(0.65 0.22 142)",
              colorBackground: "oklch(0.18 0.015 250)",
              colorForeground: "oklch(0.985 0 0)",
              colorBorder: "oklch(1 0 0 / 8%)",
            },
            elements: {
              rootBox: "flex items-center",
              organizationSwitcherTrigger: "border border-white/[0.05] bg-secondary/80 text-foreground hover:bg-secondary transition-colors rounded-lg px-2.5 py-1.5 h-8 text-[13px] font-medium max-w-[200px]",
              organizationSwitcherTriggerIcon: "text-muted-foreground",
            },
          }}
        />
        <UserButton />
      </div>
    </header>
  );
}


