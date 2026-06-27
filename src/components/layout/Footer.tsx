import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.05] bg-background py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <span className="text-xs font-black">LF</span>
              </div>
              <span>{siteConfig.name}</span>
            </Link>
            <p className="text-xs text-muted-foreground">
              The B2B Growth Operating System. Build pipeline instantly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Twitter
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-white/[0.05] pt-6 flex justify-between items-center text-left">
          <p className="text-[10px] text-muted-foreground/60 leading-normal">
            &copy; {currentYear} {siteConfig.name}. All rights reserved. Built for security, speed, and real-time operations.
          </p>
        </div>
      </div>
    </footer>
  );
}
