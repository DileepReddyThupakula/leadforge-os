"use client";

import { Lead, Company, Contact, User } from "@prisma/client";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { archiveLeadAction, restoreLeadAction, deleteLeadAction } from "@/app/actions/lead.actions";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface LeadWithRelations extends Lead {
  company: Company;
  contact?: Contact | null;
  owner?: User | null;
}

interface LeadDetailsProps {
  lead: LeadWithRelations;
}

export function LeadDetails({ lead }: LeadDetailsProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isLeadArchived = !!lead.archivedAt;

  const handleArchive = () => {
    startTransition(async () => {
      if (isLeadArchived) {
        await restoreLeadAction(lead.id);
      } else {
        await archiveLeadAction(lead.id);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteLeadAction(lead.id);
      if (res.success) {
        router.push("/dashboard/leads");
      } else {
        alert(res.error || "Delete failed.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Ribbon */}
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
        <Link href="/dashboard/leads">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Icon name="ArrowLeft" className="size-4 mr-2" />
            Back to Leads
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/dashboard/leads/new?edit=${lead.id}`}>
            <Button size="sm" variant="outline" className="border-white/[0.05]">
              <Icon name="Settings" className="size-4 mr-2" />
              Edit Lead
            </Button>
          </Link>
          <Button size="sm" variant="outline" onClick={handleArchive} className="border-white/[0.05]" disabled={isPending}>
            <Icon name={isLeadArchived ? "RefreshCw" : "Archive"} className="size-4 mr-2" />
            {isLeadArchived ? "Restore Lead" : "Archive Lead"}
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setDeleteOpen(true)} disabled={isPending}>
            <Icon name="Trash" className="size-4 mr-2" />
            Delete Lead
          </Button>
        </div>
      </div>

      {/* Main Details Panel */}
      <GlassCard className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{lead.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">Opportunity Details</p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <StatusBadge status={lead.status} />
            <PriorityBadge priority={lead.priority} />
            {isLeadArchived && (
              <span className="inline-flex items-center rounded-md border border-destructive/20 bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                Archived
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 md:border-l md:border-white/[0.05] md:pl-6 text-sm">
          <div className="flex justify-between py-1 border-b border-white/[0.04]">
            <span className="text-muted-foreground">Estimated Value:</span>
            <span className="font-semibold text-foreground font-mono">
              {lead.value ? `${Number(lead.value).toLocaleString()} ${lead.currency}` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/[0.04]">
            <span className="text-muted-foreground">Owner:</span>
            <span className="font-semibold text-foreground">
              {lead.owner ? `${lead.owner.firstName || ""} ${lead.owner.lastName || ""}` : "Unassigned"}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/[0.04]">
            <span className="text-muted-foreground">Created At:</span>
            <span className="text-foreground">{new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Last Updated:</span>
            <span className="text-foreground">{new Date(lead.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </GlassCard>

      <DeleteConfirmationDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Opportunity Lead?"
        description="This action is permanent and cannot be undone. All associated CRM records will be deleted."
        isPending={isPending}
      />
    </div>
  );
}
