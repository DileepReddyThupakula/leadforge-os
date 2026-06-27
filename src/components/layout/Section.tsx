import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function Section({
  children,
  title,
  description,
  actions,
  className,
  headerClassName,
}: SectionProps) {
  return (
    <section className={cn("space-y-6 py-6 md:py-8", className)}>
      {(title || description || actions) && (
        <div
          className={cn(
            "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
            headerClassName
          )}
        >
          <div className="space-y-1.5">
            {title && (
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      )}
      <div className="w-full">{children}</div>
    </section>
  );
}
