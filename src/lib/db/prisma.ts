import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Graceful fallback for build step verification without throwing runtime failures during static build phase
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is missing. Connection pool initialization is deferred.");
  }
}

const pool = new pg.Pool({ 
  connectionString: connectionString || "postgresql://mock:mock@localhost:5432/mock?schema=public" 
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type prisma = typeof prisma;
