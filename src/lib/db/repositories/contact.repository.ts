import { prisma } from "../prisma";
import { handleDatabaseError } from "../errors";
import { Contact, Prisma } from "@prisma/client";

export interface ContactFilterOptions {
  companyId?: string;
  search?: string;
  sortBy?: "firstName" | "lastName" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export class ContactRepository {
  static async findById(organizationId: string, id: string): Promise<Contact | null> {
    try {
      return await prisma.contact.findFirst({
        where: { id, organizationId },
        include: { company: true },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findMany(
    organizationId: string,
    options: ContactFilterOptions = {}
  ): Promise<{ data: Contact[]; total: number }> {
    try {
      const {
        companyId,
        search,
        sortBy = "lastName",
        sortOrder = "asc",
        page = 1,
        limit = 10,
      } = options;

      const skip = (page - 1) * limit;

      const where: Prisma.ContactWhereInput = {
        organizationId,
        ...(companyId && { companyId }),
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }),
      };

      const [data, total] = await Promise.all([
        prisma.contact.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: { company: true },
        }),
        prisma.contact.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async create(
    organizationId: string,
    data: Omit<Prisma.ContactUncheckedCreateInput, "organizationId">
  ): Promise<Contact> {
    try {
      return await prisma.contact.create({
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
    data: Omit<Prisma.ContactUncheckedUpdateInput, "organizationId">
  ): Promise<Contact> {
    try {
      const record = await prisma.contact.findFirst({
        where: { id, organizationId }
      });
      if (!record) {
        throw new Error("Record not found or organization mismatch.");
      }
      return await prisma.contact.update({
        where: { id },
        data,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async delete(organizationId: string, id: string): Promise<Contact> {
    try {
      const record = await prisma.contact.findFirst({
        where: { id, organizationId }
      });
      if (!record) {
        throw new Error("Record not found or organization mismatch.");
      }
      return await prisma.contact.delete({
        where: { id },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
