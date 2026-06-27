import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { LeadRepository } from "@/lib/db/repositories/lead.repository";
import { PageContainer } from "@/components/layout/PageContainer";
import { LeadDetails } from "@/components/features/leads/LeadDetails";
import { CompanyCard } from "@/components/features/leads/CompanyCard";
import { ContactCard } from "@/components/features/leads/ContactCard";

interface LeadDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadDetailsPage({ params }: LeadDetailsPageProps) {
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/onboarding");
  }

  const resolvedParams = await params;
  const id = resolvedParams.id;

  const lead = await LeadRepository.findById(orgId, id);
  if (!lead) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <LeadDetails lead={lead} />
        </div>

        {/* Associated Side Cards */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
              Associated Account
            </h3>
            <CompanyCard company={lead.company} />
          </div>

          {lead.contact && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
                Primary Contact
              </h3>
              <ContactCard contact={lead.contact} />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
