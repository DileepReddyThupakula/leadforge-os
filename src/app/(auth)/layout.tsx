import { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Dynamic ambient highlight glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(101,220,142,0.08),rgba(255,255,255,0))]" />

      <div className="w-full max-w-md space-y-6">
        {/* Logo / Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-base font-black">LF</span>
            </div>
            <span className="text-lg">{siteConfig.name}</span>
          </Link>
        </div>

        {/* Viewport for Clerk components */}
        <div className="flex justify-center w-full">{children}</div>
      </div>
    </div>
  );
}
