"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CreateOrganization } from "@clerk/nextjs";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mounted = useMounted();

  const stepParam = searchParams.get("step") || "1";
  const step = parseInt(stepParam, 10);

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Decorative background glows */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(101,220,142,0.08),rgba(255,255,255,0))]" />

      <div className="w-full max-w-xl space-y-6">
        {/* Brand / Logo */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-base font-black">LF</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">LeadForge OS Onboarding</span>
        </div>

        {/* Step Views */}
        {step === 1 && (
          <GlassCard className="p-8 space-y-6 text-center">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Welcome to LeadForge OS
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                LeadForge OS is a multi-tenant sales automation platform. To get started, you&apos;ll need to set up a workspace organization for your team.
              </p>
            </div>
            <div className="pt-4 flex justify-center">
              <Button onClick={() => router.push("/onboarding?step=2")} className="w-full sm:w-auto px-8">
                Setup Your Workspace
              </Button>
            </div>
          </GlassCard>
        )}

        {step === 2 && (
          <div className="flex justify-center w-full">
            <CreateOrganization
              routing="hash"
              afterCreateOrganizationUrl="/onboarding?step=3"
              appearance={{
                variables: {
                  colorPrimary: "oklch(0.65 0.22 142)",
                  colorBackground: "oklch(0.18 0.015 250)",
                  colorForeground: "oklch(0.985 0 0)",
                  colorInput: "oklch(0.145 0 0)",
                  colorInputForeground: "oklch(0.985 0 0)",
                  colorBorder: "oklch(1 0 0 / 8%)",
                },
                elements: {
                  card: "border border-white/[0.05] bg-card/65 backdrop-blur-xl shadow-2xl rounded-xl w-full max-w-md",
                  headerTitle: "text-foreground font-bold font-sans",
                  headerSubtitle: "text-muted-foreground font-sans text-xs",
                  formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/80 transition-colors h-8 text-sm rounded-lg",
                  formFieldLabel: "text-muted-foreground font-medium text-xs",
                },
              }}
            />
          </div>
        )}

        {step === 3 && (
          <GlassCard className="p-8 space-y-6 text-center border-primary/20 shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 mx-auto">
              <span className="text-xl font-bold">✓</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Workspace Initialized!
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your workspace is ready. You can now import leads, invite teammates, and configure outreach pipelines.
              </p>
            </div>
            <div className="pt-4 flex justify-center">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-8">
                  Enter Dashboard
                </Button>
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingContent />
    </Suspense>
  );
}
