import { prisma } from "./prisma";
import { handleDatabaseError } from "./errors";
import { Prisma } from "@prisma/client";

/**
 * Execute multiple database operations within a single PostgreSQL transaction block.
 * Wraps Prisma's $transaction API and integrates centralized error mapping.
 */
export async function runInTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(callback);
  } catch (error) {
    handleDatabaseError(error);
  }
}
