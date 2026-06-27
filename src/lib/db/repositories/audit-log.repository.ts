import { prisma } from "../prisma";
import { handleDatabaseError } from "../errors";
import { AuditLog, Prisma } from "@prisma/client";

export class AuditLogRepository {
  static async create(data: Prisma.AuditLogUncheckedCreateInput): Promise<AuditLog> {
    try {
      return await prisma.auditLog.create({ data });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findByOrganization(organizationId: string, limit = 50): Promise<AuditLog[]> {
    try {
      return await prisma.auditLog.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
