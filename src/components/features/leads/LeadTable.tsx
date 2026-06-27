"use client";

import { Lead, Company, Contact } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import Link from "next/link";
import { useState, useTransition } from "react";
import { archiveLeadAction, restoreLeadAction, deleteLeadAction } from "@/app/actions/lead.actions";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface LeadWithRelations extends Lead {
  company: Company;
  contact?: Contact | null;
}

interface LeadTableProps {
  leads: LeadWithRelations[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleArchive = (id: string, isArchived: boolean) => {
    startTransition(async () => {
      if (isArchived) {
        await restoreLeadAction(id);
      } else {
        await archiveLeadAction(id);
      }
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteLeadAction(deleteId);
      setDeleteId(null);
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.05] bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow className="border-b border-white/[0.05]">
            <TableHead className="text-muted-foreground">Title</TableHead>
            <TableHead className="text-muted-foreground">Company</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Priority</TableHead>
            <TableHead className="text-muted-foreground">Value</TableHead>
            <TableHead className="text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                No active leads found matching the filter parameters.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => {
              const isLeadArchived = !!lead.archivedAt;
              return (
                <TableRow key={lead.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <TableCell className="font-semibold text-foreground">
                    <Link href={`/dashboard/leads/${lead.id}`} className="hover:underline">
                      {lead.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {lead.company.name}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={lead.priority} />
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground">
                    {lead.value ? `${Number(lead.value).toLocaleString()} ${lead.currency}` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Link href={`/dashboard/leads/new?edit=${lead.id}`}>
                        <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Icon name="Settings" className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleArchive(lead.id, isLeadArchived)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Icon name={isLeadArchived ? "RefreshCw" : "Archive"} className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteId(lead.id)}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="Trash" className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <DeleteConfirmationDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Opportunity Lead?"
        description="This action is permanent. All associated notes and activity records will be deleted from PostgreSQL."
        isPending={isPending}
      />
    </div>
  );
}
