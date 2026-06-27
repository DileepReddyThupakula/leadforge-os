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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function WorkspaceMembersPage() {
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
  const memberships = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Workspace Members"
        description="Manage users, assign dashboard roles, and view workspace memberships."
        actions={
          <Link href="/dashboard/invitations">
            <Button size="sm">
              <Icon name="Users" className="size-4 mr-2" />
              Invite Teammate
            </Button>
          </Link>
        }
      />

      <GlassCard className="mt-6 p-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40 border-b border-white/[0.05]">
            <TableRow className="border-b border-white/[0.05]">
              <TableHead className="w-[100px] text-muted-foreground">Avatar</TableHead>
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground text-right">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.data.map((membership) => {
              const user = membership.publicUserData;
              const name = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown User";
              const email = user?.identifier || "N/A";
              const roleDisplay = membership.role === "org:admin" ? "Admin" : "Member";

              return (
                <TableRow key={membership.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <TableCell>
                    <Avatar size="sm">
                      <AvatarImage src={user?.imageUrl} alt={name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {name.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{email}</TableCell>
                  <TableCell className="text-right text-sm font-semibold text-foreground">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      membership.role === "org:admin" 
                        ? "bg-primary/10 text-primary ring-primary/20" 
                        : "bg-muted text-muted-foreground ring-muted"
                    }`}>
                      {roleDisplay}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </GlassCard>
    </PageContainer>
  );
}
