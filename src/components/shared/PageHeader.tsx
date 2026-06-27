import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border/40 pb-6 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="space-y-1.5">
        {breadcrumbs && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs}
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-base text-muted-foreground max-w-3xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0 md:self-end">
          {actions}
        </div>
      )}
    </div>
  );
}
