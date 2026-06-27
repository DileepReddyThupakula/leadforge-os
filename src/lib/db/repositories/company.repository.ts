import { prisma } from "../prisma";
import { handleDatabaseError } from "../errors";
import { Company, Prisma } from "@prisma/client";

export interface CompanyFilterOptions {
  industry?: string;
  search?: string;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export class CompanyRepository {
  static async findById(organizationId: string, id: string): Promise<Company | null> {
    try {
      return await prisma.company.findFirst({
        where: { id, organizationId },
        include: { contacts: true },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findMany(
    organizationId: string,
    options: CompanyFilterOptions = {}
  ): Promise<{ data: Company[]; total: number }> {
    try {
      const {
        industry,
        search,
        sortBy = "name",
        sortOrder = "asc",
        page = 1,
        limit = 10,
      } = options;

      const skip = (page - 1) * limit;

      const where: Prisma.CompanyWhereInput = {
        organizationId,
        ...(industry && { industry }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { website: { contains: search, mode: "insensitive" } },
            { industry: { contains: search, mode: "insensitive" } },
          ],
        }),
      };

      const [data, total] = await Promise.all([
        prisma.company.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: { _count: { select: { contacts: true, leads: true } } },
        }),
        prisma.company.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async create(
    organizationId: string, 
    data: Omit<Prisma.CompanyUncheckedCreateInput, "organizationId">
  ): Promise<Company> {
    try {
      return await prisma.company.create({
        data: {
          ...data,
          organizationId,
        },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async update(
    organizationId: string, 
    id: string, 
    data: Omit<Prisma.CompanyUncheckedUpdateInput, "organizationId">
  ): Promise<Company> {
    try {
      // Use updateMany or ensure record belongs to org by updating unique filter combination
      // For single record, we verify org matching via update where: { id } and checking organizationId matching:
      const record = await prisma.company.findFirst({
        where: { id, organizationId }
      });
      if (!record) {
        throw new Error("Record not found or organization mismatch.");
      }
      return await prisma.company.update({
        where: { id },
        data,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async delete(organizationId: string, id: string): Promise<Company> {
    try {
      const record = await prisma.company.findFirst({
        where: { id, organizationId }
      });
      if (!record) {
        throw new Error("Record not found or organization mismatch.");
      }
      return await prisma.company.delete({
        where: { id },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
