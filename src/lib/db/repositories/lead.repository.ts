import { prisma } from "../prisma";
import { handleDatabaseError } from "../errors";
import { Lead, Prisma, LeadStatus, Priority } from "@prisma/client";

export interface LeadFilterOptions {
  status?: LeadStatus;
  priority?: Priority;
  companyId?: string;
  contactId?: string;
  ownerId?: string;
  sourceId?: string;
  search?: string;
  archived?: boolean;
  sortBy?: "title" | "value" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export type LeadWithRelations = Prisma.LeadGetPayload<{
  include: {
    company: true;
    contact: true;
    source: true;
    owner: true;
    tags: true;
    notes: { orderBy: { createdAt: "desc" } };
    activities: { orderBy: { createdAt: "desc" } };
  };
}>;

export type LeadListEntry = Prisma.LeadGetPayload<{
  include: {
    company: true;
    contact: true;
    source: true;
    owner: true;
    tags: true;
  };
}>;

export class LeadRepository {
  static async findById(organizationId: string, id: string): Promise<LeadWithRelations | null> {
    try {
      return await prisma.lead.findFirst({
        where: { id, organizationId },
        include: {
          company: true,
          contact: true,
          source: true,
          owner: true,
          tags: true,
          notes: { orderBy: { createdAt: "desc" } },
          activities: { orderBy: { createdAt: "desc" } },
        },
      }) as LeadWithRelations | null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findMany(
    organizationId: string,
    options: LeadFilterOptions = {}
  ): Promise<{ data: LeadListEntry[]; total: number }> {
    try {
      const {
        status,
        priority,
        companyId,
        contactId,
        ownerId,
        sourceId,
        search,
        archived = false,
        sortBy = "createdAt",
        sortOrder = "desc",
        page = 1,
        limit = 10,
      } = options;

      const skip = (page - 1) * limit;

      const where: Prisma.LeadWhereInput = {
        organizationId,
        ...(status && { status }),
        ...(priority && { priority }),
        ...(companyId && { companyId }),
        ...(contactId && { contactId }),
        ...(ownerId && { ownerId }),
        ...(sourceId && { sourceId }),
        archivedAt: archived ? { not: null } : null,
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { company: { name: { contains: search, mode: "insensitive" } } },
            { contact: { firstName: { contains: search, mode: "insensitive" } } },
            { contact: { lastName: { contains: search, mode: "insensitive" } } },
          ],
        }),
      };

      const [data, total] = await Promise.all([
        prisma.lead.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: {
            company: true,
            contact: true,
            source: true,
            owner: true,
            tags: true,
          },
        }),
        prisma.lead.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async create(
    organizationId: string,
    data: Omit<Prisma.LeadUncheckedCreateInput, "organizationId"> & { tagIds?: string[] }
  ): Promise<Lead> {
    try {
      const { tagIds, ...leadData } = data;

      return await prisma.lead.create({
        data: {
          ...leadData,
          organizationId,
          ...(tagIds && tagIds.length > 0 && {
            tags: {
              connect: tagIds.map((id) => ({ id })),
            },
          }),
        },
        include: { tags: true },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async update(
    organizationId: string,
    id: string,
    data: Omit<Prisma.LeadUncheckedUpdateInput, "organizationId"> & { tagIds?: string[] }
  ): Promise<Lead> {
    try {
      const record = await prisma.lead.findFirst({
        where: { id, organizationId }
      });
      if (!record) {
        throw new Error("Record not found or organization mismatch.");
      }

      const { tagIds, ...leadData } = data;

      return await prisma.lead.update({
        where: { id },
        data: {
          ...leadData,
          ...(tagIds !== undefined && {
            tags: {
              set: tagIds.map((tid) => ({ id: tid })),
            },
          }),
        },
        include: { tags: true },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async delete(organizationId: string, id: string): Promise<Lead> {
    try {
      const record = await prisma.lead.findFirst({
        where: { id, organizationId }
      });
      if (!record) {
        throw new Error("Record not found or organization mismatch.");
      }
      return await prisma.lead.delete({
        where: { id },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async archive(organizationId: string, id: string): Promise<Lead> {
    try {
      const record = await prisma.lead.findFirst({
        where: { id, organizationId }
      });
      if (!record) {
        throw new Error("Record not found or organization mismatch.");
      }
      return await prisma.lead.update({
        where: { id },
        data: { archivedAt: new Date() },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
