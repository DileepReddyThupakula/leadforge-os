"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";
import { Icon } from "@/components/shared/Icon";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log exception to telemetry metrics in production
    console.error("Runtime exception captured by Global Error Boundary:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background px-4">
      <GlassCard className="max-w-md w-full text-center p-8 space-y-6 border-destructive/20 shadow-destructive/5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20">
          <Icon name="AlertTriangle" className="size-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Workspace Crash Detected
          </h2>
          <p className="text-sm text-muted-foreground">
            A runtime exception occurred while rendering this workspace. If this error persists, contact support.
          </p>
        </div>

        {/* Display diagnostic digest token if available */}
        {error.digest && (
          <div className="rounded-lg bg-secondary/80 border border-white/[0.04] p-3 text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
              Diagnostic Token
            </span>
            <code className="text-xs font-mono text-foreground break-all select-all">
              {error.digest}
            </code>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" size="sm" className="border-white/[0.08] hover:bg-white/[0.04]" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
          <Button size="sm" onClick={() => reset()}>
            Attempt Recovery
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
