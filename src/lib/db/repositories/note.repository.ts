import { prisma } from "../prisma";
import { handleDatabaseError } from "../errors";
import { Note, Prisma } from "@prisma/client";

export class NoteRepository {
  static async findById(organizationId: string, id: string): Promise<Note | null> {
    try {
      return await prisma.note.findFirst({
        where: { id, organizationId },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findByLeadId(organizationId: string, leadId: string): Promise<Note[]> {
    try {
      return await prisma.note.findMany({
        where: { leadId, organizationId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async create(
    organizationId: string,
    data: Omit<Prisma.NoteUncheckedCreateInput, "organizationId">
  ): Promise<Note> {
    try {
      return await prisma.note.create({
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
    data: Omit<Prisma.NoteUncheckedUpdateInput, "organizationId">
  ): Promise<Note> {
    try {
      const record = await prisma.note.findFirst({
        where: { id, organizationId }
      });
      if (!record) {
        throw new Error("Record not found or organization mismatch.");
      }
      return await prisma.note.update({
        where: { id },
        data,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async delete(organizationId: string, id: string): Promise<Note> {
    try {
      const record = await prisma.note.findFirst({
        where: { id, organizationId }
      });
      if (!record) {
        throw new Error("Record not found or organization mismatch.");
      }
      return await prisma.note.delete({
        where: { id },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
