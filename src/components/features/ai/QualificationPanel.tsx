import { LeadQualification } from "@prisma/client";
import { GlassCard } from "@/components/shared/GlassCard";
import { Icon, IconName } from "@/components/shared/Icon";

interface QualificationPanelProps {
  qualification?: LeadQualification | null;
}

export function QualificationPanel({ qualification }: QualificationPanelProps) {
  if (!qualification) {
    return (
      <GlassCard className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px] border-dashed border-white/[0.08]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground/60 border border-white/[0.04] mb-4">
          <Icon name="Layers" className="size-6" />
        </div>
        <h4 className="font-semibold text-foreground text-sm">No qualification data yet</h4>
        <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
          Start chatting with Aria to begin real-time parameter extraction.
        </p>
      </GlassCard>
    );
  }

  const score = qualification.score || 0;
  const intent = qualification.intent || "COLD";

  const intentBadges: Record<string, string> = {
    HOT: "bg-red-500/10 text-red-400 border-red-500/20",
    WARM: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    COLD: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const checklist: { label: string; value: string | null; icon: IconName }[] = [
    { label: "Name", value: qualification.name, icon: "User" },
    { label: "Phone", value: qualification.phone, icon: "Phone" },
    { label: "Email", value: qualification.email, icon: "Mail" },
    { label: "Property Type", value: qualification.propertyType, icon: "Building" },
    { label: "Budget", value: qualification.budget ? `$${Number(qualification.budget).toLocaleString()}` : null, icon: "DollarSign" },
    { label: "Location", value: qualification.location, icon: "Globe" },
    { label: "Timeline", value: qualification.timeline, icon: "Calendar" },
    { label: "Financing", value: qualification.financing, icon: "CreditCard" },
    { label: "Purpose", value: qualification.purpose, icon: "Layers" },
  ];

  return (
    <div className="space-y-6">
      {/* Lead Score & Intent */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
          <h4 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Lead Scoring Card</h4>
          <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold border ${intentBadges[intent]}`}>
            {intent} INTENT
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Lead Quality Score:</span>
            <span className="font-bold text-foreground font-mono">{score}/100</span>
          </div>
          <div className="w-full bg-secondary/60 h-2 rounded-full overflow-hidden border border-white/[0.04]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-orange-500" : "bg-blue-500"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Checklist */}
      <GlassCard className="p-4 space-y-3">
        <h4 className="text-xs font-bold text-muted-foreground tracking-wider uppercase border-b border-white/[0.04] pb-3">
          Qualification Attributes
        </h4>
        <div className="space-y-2.5">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-xs py-0.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name={item.icon} className="size-3.5" />
                <span>{item.label}</span>
              </div>
              <span className={`font-medium truncate max-w-[150px] ${item.value ? "text-foreground font-semibold" : "text-muted-foreground/40 font-mono italic"}`}>
                {item.value || "Undisclosed"}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Summary & Recommendation */}
      {(qualification.summary || qualification.recommendedAction) && (
        <GlassCard className="p-4 space-y-4">
          {qualification.summary && (
            <div className="space-y-1">
              <h5 className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Deal Summary</h5>
              <p className="text-xs text-foreground leading-relaxed">{qualification.summary}</p>
            </div>
          )}
          {qualification.recommendedAction && (
            <div className="space-y-1 pt-3 border-t border-white/[0.04]">
              <h5 className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase text-primary">Recommended Action</h5>
              <p className="text-xs text-foreground font-semibold leading-relaxed">{qualification.recommendedAction}</p>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
