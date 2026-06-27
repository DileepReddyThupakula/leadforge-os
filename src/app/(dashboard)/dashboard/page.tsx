import { auth, clerkClient } from "@clerk/nextjs/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { StatCard } from "@/components/shared/StatCard";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import Link from "next/link";
import { CompanyRepository } from "@/lib/db/repositories/company.repository";
import { ContactRepository } from "@/lib/db/repositories/contact.repository";
import { LeadRepository } from "@/lib/db/repositories/lead.repository";

export default async function DashboardPage() {
  const { orgId, orgRole, orgSlug } = await auth();
  
  let orgName = "Workspace";
  if (orgId) {
    const client = await clerkClient();
    const org = await client.organizations.getOrganization({ organizationId: orgId });
    orgName = org.name;
  }

  const roleDisplay = orgRole === "org:admin" ? "Administrator" : "Member";

  // Fetch real-time count metrics from PostgreSQL using the Repository layer
  let totalLeads = 0;
  let newLeads = 0;
  let qualifiedLeads = 0;
  let wonLeads = 0;
  let lostLeads = 0;
  let totalCompanies = 0;
  let totalContacts = 0;

  if (orgId) {
    const [leadsRes, newRes, qualRes, wonRes, lostRes, cosRes, contactsRes] = await Promise.all([
      LeadRepository.findMany(orgId, { limit: 1 }),
      LeadRepository.findMany(orgId, { status: "NEW", limit: 1 }),
      LeadRepository.findMany(orgId, { status: "QUALIFIED", limit: 1 }),
      LeadRepository.findMany(orgId, { status: "WON", limit: 1 }),
      LeadRepository.findMany(orgId, { status: "LOST", limit: 1 }),
      CompanyRepository.findMany(orgId, { limit: 1 }),
      ContactRepository.findMany(orgId, { limit: 1 }),
    ]);

    totalLeads = leadsRes.total;
    newLeads = newRes.total;
    qualifiedLeads = qualRes.total;
    wonLeads = wonRes.total;
    lostLeads = lostRes.total;
    totalCompanies = cosRes.total;
    totalContacts = contactsRes.total;
  }
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

      {/* Lead Opportunity KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <StatCard
          title="Total Leads"
          value={totalLeads.toString()}
          description="Active opportunities"
          icon={<Icon name="Users" className="size-4" />}
        />
        <StatCard
          title="New Leads"
          value={newLeads.toString()}
          description="Awaiting outreach"
          icon={<Icon name="Plus" className="size-4" />}
        />
        <StatCard
          title="Qualified Leads"
          value={qualifiedLeads.toString()}
          description="Verified buyers"
          icon={<Icon name="Layers" className="size-4" />}
        />
        <StatCard
          title="Won Opportunities"
          value={wonLeads.toString()}
          description="Closed won deals"
          icon={<Icon name="Check" className="size-4" />}
        />
      </div>

      {/* Account & Contact Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-6">
        <StatCard
          title="Lost Opportunities"
          value={lostLeads.toString()}
          description="Closed lost deals"
          icon={<Icon name="AlertTriangle" className="size-4" />}
        />
        <StatCard
          title="Total Companies"
          value={totalCompanies.toString()}
          description="Corporate accounts"
          icon={<Icon name="Building" className="size-4" />}
        />
        <StatCard
          title="Total Contacts"
          value={totalContacts.toString()}
          description="Individual stakeholders"
          icon={<Icon name="User" className="size-4" />}
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
          <Section title="Active Workspace" description="Multi-tenant tenant profile.">
            <GlassCard className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-white/[0.04] pb-2">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-semibold text-foreground">{orgName}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-2">
                  <span className="text-muted-foreground">Slug:</span>
                  <span className="font-mono text-foreground">{orgSlug || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-2">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-[11px] text-muted-foreground select-all break-all text-right">{orgId || "N/A"}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-semibold text-primary">{roleDisplay}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Link href="/dashboard/settings/workspace" className="w-full">
                  <Button size="xs" className="w-full" variant="secondary">
                    <Icon name="Settings" className="size-3 mr-1" />
                    Settings
                  </Button>
                </Link>
                <Link href="/dashboard/members" className="w-full">
                  <Button size="xs" className="w-full" variant="secondary">
                    <Icon name="Users" className="size-3 mr-1" />
                    Members
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </Section>

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
