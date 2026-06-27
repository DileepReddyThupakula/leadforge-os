import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LeadRepository } from "@/lib/db/repositories/lead.repository";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import Link from "next/link";
import { SearchBar } from "@/components/features/leads/SearchBar";
import { FilterPanel } from "@/components/features/leads/FilterPanel";
import { LeadTable } from "@/components/features/leads/LeadTable";
import { Pagination } from "@/components/features/leads/Pagination";
import { EmptyState } from "@/components/features/leads/EmptyState";
import { LeadStatus, Priority } from "@prisma/client";
import { Suspense } from "react";

interface LeadsPageProps {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    search?: string;
    archived?: string;
    page?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/onboarding");
  }

  const params = await searchParams;
  const status = params.status as LeadStatus | undefined;
  const priority = params.priority as Priority | undefined;
  const search = params.search || undefined;
  const archived = params.archived === "true";
  const page = parseInt(params.page || "1", 10);
  const limit = 10;

  const { data: leads, total } = await LeadRepository.findMany(orgId, {
    status,
    priority,
    search,
    archived,
    page,
    limit,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Lead Opportunities"
        description="Monitor active sales leads, qualify deals, and log outreach statuses."
        actions={
          <Link href="/dashboard/leads/new">
            <Button size="sm">
              <Icon name="Plus" className="size-4 mr-2" />
              Add Opportunity
            </Button>
          </Link>
        }
      />

      <div className="mt-6 flex flex-col gap-4">
        {/* Controls Panel */}
        <Suspense fallback={<div className="h-9 w-full bg-secondary/20 animate-pulse rounded-lg" />}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.05] pb-4">
            <SearchBar />
            <FilterPanel />
          </div>
        </Suspense>

        {/* Leads Table or Empty State */}
        {total === 0 ? (
          <EmptyState
            title={search || status || priority ? "No matching leads found" : "No leads in this workspace"}
            description={
              search || status || priority
                ? "Try adjusting your search queries or active filters to locate the opportunity."
                : "Create your first opportunity to track deal values and assign statuses."
            }
            actionLabel={search || status || priority ? undefined : "Add Opportunity"}
            actionHref={search || status || priority ? undefined : "/dashboard/leads/new"}
          />
        ) : (
          <div className="space-y-4">
            <LeadTable leads={leads} />
            <Pagination totalItems={total} itemsPerPage={limit} />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
