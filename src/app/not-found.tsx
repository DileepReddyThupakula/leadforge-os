import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";
import { Icon } from "@/components/shared/Icon";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background px-4">
      <GlassCard className="max-w-md w-full text-center p-8 space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
          <Icon name="Globe" className="size-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            404 - Page Not Found
          </h2>
          <p className="text-sm text-muted-foreground">
            The page you are looking for does not exist, has been archived, or you do not have permission to view it.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full border-white/[0.08] hover:bg-white/[0.04]">
              Marketing Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
