import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    type: "positive" | "negative" | "neutral";
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <GlassCard hoverEffect className={cn("p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/80 border border-white/[0.04] text-muted-foreground shrink-0">
            {icon}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
        {(description || trend) && (
          <div className="flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  "font-semibold rounded-md px-1.5 py-0.5",
                  trend.type === "positive" && "bg-primary/10 text-primary",
                  trend.type === "negative" && "bg-destructive/10 text-destructive",
                  trend.type === "neutral" && "bg-muted text-muted-foreground"
                )}
              >
                {trend.value}
              </span>
            )}
            {description && (
              <span className="text-muted-foreground line-clamp-1">{description}</span>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
