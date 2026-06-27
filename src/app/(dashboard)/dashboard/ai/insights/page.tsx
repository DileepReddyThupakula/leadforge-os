import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { LeadRepository } from "@/lib/db/repositories/lead.repository";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { GlassCard } from "@/components/shared/GlassCard";
import { Icon } from "@/components/shared/Icon";
import { AITaskList } from "@/components/features/ai/AITaskList";
import { StatusBadge } from "@/components/features/leads/StatusBadge";
import { PriorityBadge } from "@/components/features/leads/PriorityBadge";
import Link from "next/link";

export default async function AIInsightsPage() {
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/onboarding");
  }

  // 1. Fetch aggregates
  const qualifications = await prisma.leadQualification.findMany({
    where: { organizationId: orgId },
  });
  const metrics = await prisma.qualificationMetric.findMany({
    where: { organizationId: orgId },
  });
  const pendingTasksCount = await prisma.aITask.count({
    where: { organizationId: orgId, status: "PENDING" },
  });

  const avgScore =
    qualifications.length > 0
      ? qualifications.reduce((acc, q) => acc + (q.score || 0), 0) / qualifications.length
      : 0;

  const hotLeadsCount = qualifications.filter((q) => q.intent === "HOT").length;

  const avgCompletion =
    metrics.length > 0
      ? metrics.reduce((acc, m) => acc + m.completionPercentage, 0) / metrics.length
      : 0;

  // 2. Fetch High-Value leads & Hot leads
  const { data: highestValueLeads } = await LeadRepository.findMany(orgId, {
    limit: 5,
    sortBy: "value",
    sortOrder: "desc",
  });

  // 3. Fetch Recommendations and pending tasks
  const recommendations = await prisma.aIRecommendation.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { lead: true },
  });

  const pendingTasks = await prisma.aITask.findMany({
    where: { organizationId: orgId, status: "PENDING" },
    orderBy: { dueDate: "asc" },
    take: 10,
  });

  return (
    <PageContainer>
      <PageHeader
        title="AI Decision Engine Insights"
        description="Monitor automated CRM tasks, buy confidence metrics, and AI explainability rationales."
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <StatCard
          title="Average Lead Score"
          value={`${Math.round(avgScore)}/100`}
          description="Average buyer score"
          icon={<Icon name="Users" className="size-4" />}
        />
        <StatCard
          title="Hot Leads (Aria)"
          value={hotLeadsCount.toString()}
          description="Strong purchase intent"
          icon={<Icon name="AlertTriangle" className="size-4" />}
        />
        <StatCard
          title="CRM Action Tasks"
          value={pendingTasksCount.toString()}
          description="Awaiting follow-up"
          icon={<Icon name="Layers" className="size-4" />}
        />
        <StatCard
          title="Qualification Completion"
          value={`${Math.round(avgCompletion)}%`}
          description="Avg profile filled"
          icon={<Icon name="Check" className="size-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Side: High Value Leads & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Highest Value Leads */}
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground tracking-wider uppercase border-b border-white/[0.04] pb-3">
              Highest-Value Opportunity Leads
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-muted-foreground border-b border-white/[0.04]">
                    <th className="py-2 font-semibold">Title</th>
                    <th className="py-2 font-semibold">Status</th>
                    <th className="py-2 font-semibold">Priority</th>
                    <th className="py-2 font-semibold text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {highestValueLeads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-muted-foreground/60">
                        No opportunities registered yet.
                      </td>
                    </tr>
                  ) : (
                    highestValueLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                        <td className="py-2.5 font-semibold text-foreground">
                          <Link href={`/dashboard/leads/${lead.id}`} className="hover:underline">
                            {lead.title}
                          </Link>
                        </td>
                        <td className="py-2.5">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="py-2.5">
                          <PriorityBadge priority={lead.priority} />
                        </td>
                        <td className="py-2.5 text-right font-mono text-foreground font-semibold">
                          {lead.value ? `${Number(lead.value).toLocaleString()} ${lead.currency}` : "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* AI Decision Recommendations & Rationale */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
              AI Decision Logs & Explainability
            </h3>
            <div className="space-y-4">
              {recommendations.length === 0 ? (
                <GlassCard className="p-6 text-center text-muted-foreground/60 border-dashed border-white/[0.08]">
                  No decision recommendation logs present yet.
                </GlassCard>
              ) : (
                recommendations.map((rec) => (
                  <GlassCard key={rec.id} className="p-4 space-y-3 border-l-4 border-l-primary">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                          AI Recommendation
                        </span>
                        <h4 className="text-xs font-bold text-foreground">
                          Action: <span className="text-primary">{rec.action}</span>
                        </h4>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono">
                        {new Date(rec.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-muted-foreground/80 tracking-wider uppercase">
                        Explainability Audit Log:
                      </span>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line bg-secondary/20 p-2.5 rounded border border-white/[0.03]">
                        {rec.reason}
                      </p>
                    </div>
                    {rec.riskFlags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rec.riskFlags.map((flag) => (
                          <span key={flag} className="inline-flex items-center rounded bg-destructive/10 border border-destructive/20 px-1.5 py-0.5 text-[9px] font-semibold text-destructive">
                            ⚠️ {flag}
                          </span>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Pending CRM Tasks */}
        <div className="lg:col-span-1">
          <GlassCard className="p-5 space-y-4 h-full">
            <h3 className="text-sm font-bold text-foreground tracking-wider uppercase border-b border-white/[0.04] pb-3">
              Pending CRM Tasks
            </h3>
            <AITaskList tasks={pendingTasks} />
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}
