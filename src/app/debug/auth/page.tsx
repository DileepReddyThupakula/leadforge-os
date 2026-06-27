import { auth, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DebugAuthPage() {
  const authPayload = await auth();
  const user = await currentUser();
  const headersList = await headers();

  // Log active auth payload to server console
  console.log("Clerk Auth debug payload:", JSON.stringify(authPayload, null, 2));

  // Reconstruct current request URL from headers
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const currentUrl = `${protocol}://${host}/debug/auth`;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-2xl w-full border border-white/[0.05] bg-card/65 backdrop-blur-xl shadow-2xl rounded-xl p-6 md:p-8 space-y-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Clerk Authentication Diagnostics
        </h1>
        <div className="space-y-3 divide-y divide-white/[0.05] text-sm">
          <div className="grid grid-cols-3 py-2 gap-4">
            <span className="font-semibold text-muted-foreground">isSignedIn:</span>
            <span className="col-span-2 font-mono text-primary">
              {authPayload.userId ? "true" : "false"}
            </span>
          </div>
          <div className="grid grid-cols-3 py-2 gap-4">
            <span className="font-semibold text-muted-foreground">userId:</span>
            <span className="col-span-2 font-mono text-foreground">
              {authPayload.userId || "null"}
            </span>
          </div>
          <div className="grid grid-cols-3 py-2 gap-4">
            <span className="font-semibold text-muted-foreground">sessionId:</span>
            <span className="col-span-2 font-mono text-foreground">
              {authPayload.sessionId || "null"}
            </span>
          </div>
          <div className="grid grid-cols-3 py-2 gap-4">
            <span className="font-semibold text-muted-foreground">organizationId:</span>
            <span className="col-span-2 font-mono text-foreground">
              {authPayload.orgId || "null"}
            </span>
          </div>
          <div className="grid grid-cols-3 py-2 gap-4">
            <span className="font-semibold text-muted-foreground">currentUser.emailAddresses:</span>
            <div className="col-span-2 font-mono text-foreground space-y-1">
              {user?.emailAddresses && user.emailAddresses.length > 0 ? (
                user.emailAddresses.map((email) => (
                  <div key={email.emailAddress}>{email.emailAddress}</div>
                ))
              ) : (
                "null"
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 py-2 gap-4">
            <span className="font-semibold text-muted-foreground">current URL:</span>
            <span className="col-span-2 font-mono text-foreground break-all">
              {currentUrl}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
