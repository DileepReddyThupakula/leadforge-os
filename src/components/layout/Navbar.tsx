"use client";

import Link from "next/link";
import { siteConfig, marketingConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Icon } from "@/components/shared/Icon";
import { useMounted } from "@/hooks/use-mounted";
import { Show, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const mounted = useMounted();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.05] bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-black">LF</span>
          </div>
          <span>{siteConfig.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {marketingConfig.mainNav.map((item) => (
            <Link
              key={item.title}
              href={item.disabled ? "#" : item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Show when="signed-out">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="border-white/[0.08] hover:bg-white/[0.04]">
                Go to Dashboard
              </Button>
            </Link>
            <UserButton />
          </Show>
        </div>

        {/* Mobile Navigation Trigger */}
        {mounted && (
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                  <Icon name="Menu" className="size-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-l border-white/[0.05] bg-card p-6">
                <SheetHeader className="p-0 pb-4 border-b border-border/40">
                  <SheetTitle className="text-left font-bold text-foreground">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-6">
                  {marketingConfig.mainNav.map((item) => (
                    <Link
                      key={item.title}
                      href={item.disabled ? "#" : item.href}
                      className="text-base font-medium text-muted-foreground hover:text-foreground"
                    >
                      {item.title}
                    </Link>
                  ))}
                  <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border/40">
                    <Show when="signed-out">
                      <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full" size="sm">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register" className="w-full">
                        <Button className="w-full" size="sm">
                          Get Started
                        </Button>
                      </Link>
                    </Show>
                    <Show when="signed-in">
                      <Link href="/dashboard" className="w-full">
                        <Button className="w-full" size="sm">
                          Go to Dashboard
                        </Button>
                      </Link>
                      <div className="flex justify-start py-2">
                        <UserButton />
                      </div>
                    </Show>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
}
