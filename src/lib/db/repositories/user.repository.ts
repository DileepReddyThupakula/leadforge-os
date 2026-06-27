import { prisma } from "../prisma";
import { handleDatabaseError } from "../errors";
import { User, Prisma } from "@prisma/client";

export class UserRepository {
  static async findById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findByClerkId(clerkId: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { clerkId } });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async updateByClerkId(clerkId: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await prisma.user.update({
        where: { clerkId },
        data,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async deleteByClerkId(clerkId: string): Promise<User> {
    try {
      return await prisma.user.delete({ where: { clerkId } });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
