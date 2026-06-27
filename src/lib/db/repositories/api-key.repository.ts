import { prisma } from "../prisma";
import { handleDatabaseError } from "../errors";
import { ApiKey, Prisma } from "@prisma/client";

export class ApiKeyRepository {
  static async findByHash(keyHash: string): Promise<ApiKey | null> {
    try {
      return await prisma.apiKey.findUnique({
        where: { keyHash },
        include: {
          organization: true,
          user: true,
        },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async create(data: Prisma.ApiKeyUncheckedCreateInput): Promise<ApiKey> {
    try {
      return await prisma.apiKey.create({ data });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findByOrganization(organizationId: string): Promise<ApiKey[]> {
    try {
      return await prisma.apiKey.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async delete(id: string): Promise<ApiKey> {
    try {
      return await prisma.apiKey.delete({ where: { id } });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
