import { NextResponse } from "next/server";
import { HealthCheckResponse } from "@/types";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  try {
    // Perform a raw database query ping to confirm PostgreSQL connectivity
    await prisma.$queryRaw`SELECT 1`;

    const response: HealthCheckResponse = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: "connected",
        cache: "connected", // Placeholder for future Redis client integration
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "x-response-time-ms": (Date.now() - start).toString(),
        "cache-control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Health check database ping failed:", error);

    const errorResponse: HealthCheckResponse = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: "disconnected",
        cache: "disconnected",
      },
    };

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        "x-response-time-ms": (Date.now() - start).toString(),
        "cache-control": "no-store, max-age=0",
      },
    });
  }
}
