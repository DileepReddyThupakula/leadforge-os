import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <GlassCard className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
        <Icon name="Users" className="size-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button size="sm">
            <Icon name="Plus" className="size-4 mr-2" />
            {actionLabel}
          </Button>
        </Link>
      )}
    </GlassCard>
  );
}
