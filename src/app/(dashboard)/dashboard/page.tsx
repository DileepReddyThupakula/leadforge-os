import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { StatCard } from "@/components/shared/StatCard";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";

export default function DashboardPage() {
  return (
    <PageContainer>
      {/* Page Header with action buttons */}
      <PageHeader
        title="Workspace Overview"
        description="Monitor lead orchestration activity, enrichments, and sequence outreach performance."
        actions={
          <>
            <Button variant="outline" size="sm" className="border-white/[0.08] hover:bg-white/[0.04]">
              <Icon name="Layers" className="size-4 mr-2" />
              Manage Workspaces
            </Button>
            <Button size="sm">
              <Icon name="Users" className="size-4 mr-2" />
              Import Leads
            </Button>
          </>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <StatCard
          title="Total Leads Ingested"
          value="148,290"
          description="from all channels"
          trend={{ value: "+12.4%", type: "positive" }}
          icon={<Icon name="Users" className="size-4" />}
        />
        <StatCard
          title="Enrichment Matches"
          value="94.2%"
          description="average match rate"
          trend={{ value: "+2.1%", type: "positive" }}
          icon={<Icon name="Cpu" className="size-4" />}
        />
        <StatCard
          title="Sequence Outreach"
          value="87,301"
          description="active emails sent"
          trend={{ value: "-1.5%", type: "negative" }}
          icon={<Icon name="Mail" className="size-4" />}
        />
        <StatCard
          title="Workspace Status"
          value="Healthy"
          description="API latency 24ms"
          trend={{ value: "100%", type: "neutral" }}
          icon={<Icon name="Globe" className="size-4" />}
        />
      </div>

      {/* Workspace Activity Skeletons / Containers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
        {/* Main activity list placeholder section */}
        <div className="lg:col-span-2 space-y-6">
          <Section
            title="Real-time Ingestion Streams"
            description="Hook payloads and live updates from your connected integrations."
          >
            <GlassCard className="flex flex-col items-center justify-center py-16 text-center border-dashed border-white/[0.08]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground border border-white/[0.04] mb-4">
                <Icon name="Layers" className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No active lead streams</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Connect external scrapers or webhooks to start feeding leads directly to your tables.
              </p>
              <Button size="sm" className="mt-4" variant="outline">
                Configure Ingestion Webhook
              </Button>
            </GlassCard>
          </Section>
        </div>

        {/* Workspace Quick Details */}
        <div className="space-y-6">
          <Section title="Active Pipelines" description="Operational enrichment services.">
            <GlassCard className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-medium text-foreground">LinkedIn Scraper</span>
                  </div>
                  <span className="text-muted-foreground text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-medium text-foreground">Clearbit Enrichment</span>
                  </div>
                  <span className="text-muted-foreground text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="font-medium text-foreground">Hunter.io Verification</span>
                  </div>
                  <span className="text-muted-foreground text-xs text-destructive">Rate Limited</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-2" variant="secondary">
                View Integration Logs
              </Button>
            </GlassCard>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
}
