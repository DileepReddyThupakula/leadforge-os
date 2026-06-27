import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadForge OS",
  description: "B2B Sales Automation & Lead Orchestration Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  const hasPlaceholderKeys =
    !publishableKey ||
    !secretKey ||
    publishableKey.includes("xxxxxxxxxxxxxxxxxxxxxxxxxx") ||
    secretKey.includes("xxxxxxxxxxxxxxxxxxxxxxxxxx");

  if (hasPlaceholderKeys) {
    return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
        style={{ colorScheme: "dark" }}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2 justify-center font-bold tracking-tight text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-base font-black">LF</span>
              </div>
              <span className="text-xl">LeadForge OS</span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-card/65 backdrop-blur-xl border border-white/[0.06] shadow-2xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                  <span className="text-lg font-bold">!</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Identity Platform Config Required
                </h1>
                <p className="text-sm text-muted-foreground max-w-md">
                  LeadForge OS uses Clerk to secure workspace endpoints. Please configure your environment credentials in <code className="text-foreground bg-secondary px-1 py-0.5 rounded text-xs">.env</code> to start local development.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Quick Setup Onboarding steps:</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-start gap-3 rounded-lg border border-white/[0.03] bg-secondary/30 p-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      1
                    </span>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Register a Clerk Application</p>
                      <p className="text-xs text-muted-foreground">
                        Sign up or log in at the{" "}
                        <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                          Clerk Dashboard
                        </a>{" "}
                        and configure a new application instance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-white/[0.03] bg-secondary/30 p-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      2
                    </span>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Copy Environment Credentials</p>
                      <p className="text-xs text-muted-foreground">
                        Navigate to the <span className="font-medium text-foreground">API Keys</span> tab in the sidebar, and copy the Publishable key and Secret key.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-white/[0.03] bg-secondary/30 p-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      3
                    </span>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Paste credentials into your local <code className="text-xs">.env</code> file</p>
                      <p className="text-xs text-muted-foreground">
                        Update the following variables inside your <code className="text-xs">.env</code> with your copied keys:
                      </p>
                      <pre className="text-xs font-mono bg-background p-2 rounded border border-white/[0.04] text-muted-foreground leading-normal mt-1.5 select-all">
{`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.05] flex flex-col gap-2 sm:flex-row sm:justify-end">
                <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/80 transition-colors cursor-pointer">
                    Clerk Dashboard
                  </button>
                </a>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
        style={{ colorScheme: "dark" }}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
