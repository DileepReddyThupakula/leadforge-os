"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { LeadRepository } from "@/lib/db/repositories/lead.repository";
import { leadSchema, LeadInput } from "@/lib/validation/lead";
import { Prisma } from "@prisma/client";

export async function createLeadAction(input: LeadInput) {
  const { orgId } = await auth();
  if (!orgId) {
    return { success: false, error: "Active organization required." };
  }

  try {
    const validated = leadSchema.parse(input);

    const lead = await LeadRepository.create(orgId, {
      title: validated.title,
      companyId: validated.companyId,
      contactId: validated.contactId || null,
      status: validated.status,
      priority: validated.priority,
      value: validated.value !== null && validated.value !== undefined ? new Prisma.Decimal(validated.value) : null,
      currency: validated.currency,
      sourceId: validated.sourceId || null,
      ownerId: validated.ownerId || null,
    });

    revalidatePath("/dashboard/leads");
    return { success: true, data: lead };
  } catch (error) {
    console.error("Error creating lead:", error);
    const message = error instanceof Error ? error.message : "Failed to create lead.";
    return { success: false, error: message };
  }
}

export async function updateLeadAction(id: string, input: LeadInput) {
  const { orgId } = await auth();
  if (!orgId) {
    return { success: false, error: "Active organization required." };
  }

  try {
    const validated = leadSchema.parse(input);

    const lead = await LeadRepository.update(orgId, id, {
      title: validated.title,
      companyId: validated.companyId,
      contactId: validated.contactId || null,
      status: validated.status,
      priority: validated.priority,
      value: validated.value !== null && validated.value !== undefined ? new Prisma.Decimal(validated.value) : null,
      currency: validated.currency,
      sourceId: validated.sourceId || null,
      ownerId: validated.ownerId || null,
    });

    revalidatePath("/dashboard/leads");
    revalidatePath(`/dashboard/leads/${id}`);
    return { success: true, data: lead };
  } catch (error) {
    console.error("Error updating lead:", error);
    const message = error instanceof Error ? error.message : "Failed to update lead.";
    return { success: false, error: message };
  }
}

export async function archiveLeadAction(id: string) {
  const { orgId } = await auth();
  if (!orgId) {
    return { success: false, error: "Active organization required." };
  }

  try {
    await LeadRepository.archive(orgId, id);
    revalidatePath("/dashboard/leads");
    revalidatePath(`/dashboard/leads/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error archiving lead:", error);
    const message = error instanceof Error ? error.message : "Failed to archive lead.";
    return { success: false, error: message };
  }
}

export async function restoreLeadAction(id: string) {
  const { orgId } = await auth();
  if (!orgId) {
    return { success: false, error: "Active organization required." };
  }

  try {
    await LeadRepository.update(orgId, id, { archivedAt: null });
    revalidatePath("/dashboard/leads");
    revalidatePath(`/dashboard/leads/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error restoring lead:", error);
    const message = error instanceof Error ? error.message : "Failed to restore lead.";
    return { success: false, error: message };
  }
}

export async function deleteLeadAction(id: string) {
  const { orgId } = await auth();
  if (!orgId) {
    return { success: false, error: "Active organization required." };
  }

  try {
    await LeadRepository.delete(orgId, id);
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    const message = error instanceof Error ? error.message : "Failed to delete lead.";
    return { success: false, error: message };
  }
}
