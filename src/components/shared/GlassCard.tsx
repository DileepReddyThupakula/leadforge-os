import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverEffect?: boolean;
}

export function GlassCard({
  children,
  hoverEffect = false,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-card/65 backdrop-blur-xl border border-white/[0.06] shadow-2xl p-6 transition-all duration-300",
        hoverEffect && "hover:border-primary/20 hover:bg-card/80 hover:shadow-primary/5 hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {/* Dynamic ambient highlight glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
