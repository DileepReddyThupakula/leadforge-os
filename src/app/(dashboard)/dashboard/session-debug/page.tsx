import { auth, currentUser } from "@clerk/nextjs/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { GlassCard } from "@/components/shared/GlassCard";

export default async function SessionDebugPage() {
  const { userId, orgId } = await auth();
  const user = await currentUser();

  return (
    <PageContainer>
      <PageHeader
        title="Session Diagnostics Debugger"
        description="Verify Clerk Identity Platform connection latency and active tokens."
      />
      <div className="mt-6">
        <GlassCard className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-muted-foreground font-medium">Is Signed In:</div>
            <div className="text-primary font-bold">{userId ? "true" : "false"}</div>

            <div className="text-muted-foreground font-medium">User ID (userId):</div>
            <div className="font-mono text-foreground">{userId || "null"}</div>

            <div className="text-muted-foreground font-medium">Organization ID (orgId):</div>
            <div className="font-mono text-foreground">{orgId || "null"}</div>

            <div className="text-muted-foreground font-medium">Full Name (currentUser):</div>
            <div className="text-foreground">
              {user ? `${user.firstName || ""} ${user.lastName || ""}` : "null"}
            </div>

            <div className="text-muted-foreground font-medium">Email Address:</div>
            <div className="font-mono text-foreground">
              {user?.emailAddresses?.[0]?.emailAddress || "null"}
            </div>
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  );
}
