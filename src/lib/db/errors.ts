import { Prisma } from "@prisma/client";

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export function handleDatabaseError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === "P2002") {
      throw new DatabaseError(
        `Unique constraint violation on field(s): ${
          Array.isArray(error.meta?.target) 
            ? error.meta.target.join(", ") 
            : error.meta?.target || "unknown"
        }`,
        "UNIQUE_VIOLATION",
        error
      );
    }
    // Foreign key constraint violation
    if (error.code === "P2003") {
      throw new DatabaseError(
        "Foreign key constraint violation in database reference.",
        "FOREIGN_KEY_VIOLATION",
        error
      );
    }
    // Record not found
    if (error.code === "P2025") {
      throw new DatabaseError(
        "Requested database record was not found.",
        "RECORD_NOT_FOUND",
        error
      );
    }
  }

  if (error instanceof DatabaseError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new DatabaseError(error.message, "DATABASE_ERROR", error);
  }

  throw new DatabaseError("An unknown database error occurred.", "UNKNOWN_ERROR", error);
}
