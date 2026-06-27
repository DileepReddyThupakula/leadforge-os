import { prisma } from "../prisma";
import { handleDatabaseError } from "../errors";
import { LeadActivity, Prisma } from "@prisma/client";

export class ActivityRepository {
  static async findById(organizationId: string, id: string): Promise<LeadActivity | null> {
    try {
      return await prisma.leadActivity.findFirst({
        where: { id, organizationId },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findByLeadId(organizationId: string, leadId: string): Promise<LeadActivity[]> {
    try {
      return await prisma.leadActivity.findMany({
        where: { leadId, organizationId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async create(
    organizationId: string,
    data: Omit<Prisma.LeadActivityUncheckedCreateInput, "organizationId">
  ): Promise<LeadActivity> {
    try {
      return await prisma.leadActivity.create({
        data: {
          ...data,
          organizationId,
        },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async delete(organizationId: string, id: string): Promise<LeadActivity> {
    try {
      const record = await prisma.leadActivity.findFirst({
        where: { id, organizationId }
      });
      if (!record) {
        throw new Error("Record not found or organization mismatch.");
      }
      return await prisma.leadActivity.delete({
        where: { id },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
