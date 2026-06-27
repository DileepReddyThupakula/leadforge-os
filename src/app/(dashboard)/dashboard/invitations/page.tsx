import { auth, clerkClient } from "@clerk/nextjs/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function WorkspaceInvitationsPage() {
  const { orgId } = await auth();

  if (!orgId) {
    return (
      <PageContainer>
        <GlassCard className="text-center py-12">
          <p className="text-muted-foreground">No active organization selected.</p>
        </GlassCard>
      </PageContainer>
    );
  }

  const client = await clerkClient();
  const invitations = await client.organizations.getOrganizationInvitationList({
    organizationId: orgId,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Pending Workspace Invitations"
        description="View sent invitations or manage outbound team requests."
        actions={
          <Link href="/dashboard/members">
            <Button variant="outline" size="sm" className="border-white/[0.08] hover:bg-white/[0.04]">
              <Icon name="Users" className="size-4 mr-2" />
              View Active Members
            </Button>
          </Link>
        }
      />

      <GlassCard className="mt-6 p-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40 border-b border-white/[0.05]">
            <TableRow className="border-b border-white/[0.05]">
              <TableHead className="text-muted-foreground">Invitee Email</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  No pending invitations found. Use Clerk&apos;s organization settings to invite members.
                </TableCell>
              </TableRow>
            ) : (
              invitations.data.map((invitation) => {
                const createdDate = new Date(invitation.createdAt).toLocaleDateString();
                const roleDisplay = invitation.role === "org:admin" ? "Admin" : "Member";

                return (
                  <TableRow key={invitation.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <TableCell className="font-mono text-xs text-foreground font-medium">
                      {invitation.emailAddress}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        invitation.role === "org:admin" 
                          ? "bg-primary/10 text-primary ring-primary/20" 
                          : "bg-muted text-muted-foreground ring-muted"
                      }`}>
                        {roleDisplay}
                      </span>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground text-xs">{invitation.status}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{createdDate}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </GlassCard>
    </PageContainer>
  );
}
