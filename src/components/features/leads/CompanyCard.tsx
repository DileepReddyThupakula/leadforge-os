import { Company } from "@prisma/client";
import { GlassCard } from "@/components/shared/GlassCard";
import { Icon } from "@/components/shared/Icon";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
          <Icon name="Building" className="size-5" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">{company.name}</h4>
          <span className="text-xs text-muted-foreground">{company.industry || "No Industry Listed"}</span>
        </div>
      </div>
      {company.website && (
        <div className="space-y-2 text-sm pt-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Globe" className="size-4 shrink-0" />
            <a
              href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-mono text-xs hover:underline"
            >
              {company.website}
            </a>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
