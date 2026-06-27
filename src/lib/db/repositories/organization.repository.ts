import { prisma } from "../prisma";
import { handleDatabaseError } from "../errors";
import { Organization, Membership, Role, Prisma } from "@prisma/client";

export class OrganizationRepository {
  static async findById(id: string): Promise<Organization | null> {
    try {
      return await prisma.organization.findUnique({ where: { id } });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findByClerkOrgId(clerkOrgId: string): Promise<Organization | null> {
    try {
      return await prisma.organization.findUnique({ where: { clerkOrgId } });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    try {
      return await prisma.organization.create({ data });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async updateByClerkOrgId(clerkOrgId: string, data: Prisma.OrganizationUpdateInput): Promise<Organization> {
    try {
      return await prisma.organization.update({
        where: { clerkOrgId },
        data,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async deleteByClerkOrgId(clerkOrgId: string): Promise<Organization> {
    try {
      return await prisma.organization.delete({ where: { clerkOrgId } });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  // Membership helpers
  static async findMembership(clerkMemberId: string): Promise<Membership | null> {
    try {
      return await prisma.membership.findUnique({ where: { clerkMemberId } });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async createMembership(data: {
    clerkMemberId: string;
    role: Role;
    userId: string;
    organizationId: string;
  }): Promise<Membership> {
    try {
      return await prisma.membership.create({ data });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async updateMembership(clerkMemberId: string, role: Role): Promise<Membership> {
    try {
      return await prisma.membership.update({
        where: { clerkMemberId },
        data: { role },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async deleteMembership(clerkMemberId: string): Promise<Membership> {
    try {
      return await prisma.membership.delete({ where: { clerkMemberId } });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
