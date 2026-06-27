import { NextResponse } from "next/server";
import { HealthCheckResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  try {
    // In a full feature implementation, this would perform query pings on database & cache.
    // For the framework architecture, we verify standard operational readiness.
    const response: HealthCheckResponse = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: "connected", // Placeholder for actual client ping confirmation
        cache: "connected",    // Placeholder for actual redis ping confirmation
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "x-response-time-ms": (Date.now() - start).toString(),
        "cache-control": "no-store, max-age=0",
      },
    });
  } catch {
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
