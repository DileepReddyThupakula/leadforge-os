"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { LeadStatus, Priority } from "@prisma/client";

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const activeStatus = searchParams.get("status") || "";
  const activePriority = searchParams.get("priority") || "";
  const isArchived = searchParams.get("archived") === "true";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset pagination

    startTransition(() => {
      router.push(`/dashboard/leads?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter */}
      <select
        value={activeStatus}
        onChange={(e) => updateParam("status", e.target.value)}
        className="h-9 px-3 rounded-lg border border-white/[0.05] bg-secondary/30 text-sm text-foreground focus:outline-none focus:border-primary/50"
      >
        <option value="">All Statuses</option>
        {Object.values(LeadStatus).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {/* Priority Filter */}
      <select
        value={activePriority}
        onChange={(e) => updateParam("priority", e.target.value)}
        className="h-9 px-3 rounded-lg border border-white/[0.05] bg-secondary/30 text-sm text-foreground focus:outline-none focus:border-primary/50"
      >
        <option value="">All Priorities</option>
        {Object.values(Priority).map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>

      {/* Archived Toggle */}
      <button
        onClick={() => updateParam("archived", isArchived ? "false" : "true")}
        className={`h-9 px-4 rounded-lg border text-sm font-medium transition-colors ${
          isArchived
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-white/[0.05] bg-secondary/30 text-muted-foreground hover:text-foreground"
        }`}
      >
        {isArchived ? "Viewing Archived" : "View Archive"}
      </button>
    </div>
  );
}
