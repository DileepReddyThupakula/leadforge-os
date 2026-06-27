import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LeadRepository } from "@/lib/db/repositories/lead.repository";
import { CompanyRepository } from "@/lib/db/repositories/company.repository";
import { ContactRepository } from "@/lib/db/repositories/contact.repository";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { LeadForm } from "@/components/features/leads/LeadForm";

interface NewLeadPageProps {
  searchParams: Promise<{
    edit?: string;
  }>;
}

export default async function NewLeadPage({ searchParams }: NewLeadPageProps) {
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/onboarding");
  }

  const params = await searchParams;
  const editId = params.edit;

  let initialLead = null;
  if (editId) {
    initialLead = await LeadRepository.findById(orgId, editId);
    if (!initialLead) {
      redirect("/dashboard/leads");
    }
  }

  // Fetch company accounts and contact points for selection
  const { data: companies } = await CompanyRepository.findMany(orgId, { limit: 100 });
  const { data: contacts } = await ContactRepository.findMany(orgId, { limit: 100 });

  return (
    <PageContainer>
      <PageHeader
        title={initialLead ? "Edit Opportunity Lead" : "New Lead Opportunity"}
        description={
          initialLead
            ? "Modify current deal sizes, pipeline values, and team assignees."
            : "Register a new CRM lead opportunity to begin enrichment scoring pipelines."
        }
      />
      <div className="mt-6">
        <LeadForm initialData={initialLead} companies={companies} contacts={contacts} />
      </div>
    </PageContainer>
  );
}
