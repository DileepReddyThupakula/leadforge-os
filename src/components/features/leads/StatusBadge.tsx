import { LeadStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: LeadStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<LeadStatus, string> = {
    NEW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    CONTACTED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    QUALIFIED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    PROPOSAL: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    NEGOTIATION: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    WON: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    LOST: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  const statusLabels: Record<LeadStatus, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    QUALIFIED: "Qualified",
    PROPOSAL: "Proposal",
    NEGOTIATION: "Negotiation",
    WON: "Won",
    LOST: "Lost",
  };

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
