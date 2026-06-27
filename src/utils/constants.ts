export const APP_CONSTANTS = {
  cookieKeys: {
    session: "leadforge_session_token",
    workspaceId: "leadforge_active_workspace_id",
  },
  headers: {
    workspaceId: "x-leadforge-workspace-id",
    rateLimitLimit: "x-ratelimit-limit",
    rateLimitRemaining: "x-ratelimit-remaining",
    rateLimitReset: "x-ratelimit-reset",
  },
  rateLimits: {
    anonymousLimit: 60, // requests per minute
    authenticatedLimit: 120, // requests per minute
    webhookLimit: 300, // requests per minute
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  environments: {
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
    isTest: process.env.NODE_ENV === "test",
  },
} as const;
