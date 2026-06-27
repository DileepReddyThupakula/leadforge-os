import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Retrieve Clerk secret key
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("CLERK_WEBHOOK_SECRET environment variable is missing.", {
      status: 500,
    });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers.", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Invalid signature.", {
      status: 400,
    });
  }

  // Handle Clerk Event types
  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === "user.created") {
      const { email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses?.[0]?.email_address;

      if (!primaryEmail) {
        return new Response("User has no email address.", { status: 400 });
      }

      await prisma.user.create({
        data: {
          clerkId: id!,
          email: primaryEmail,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
      });
    }

    if (eventType === "user.updated") {
      const { email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses?.[0]?.email_address;

      if (!primaryEmail) {
        return new Response("User has no email address.", { status: 400 });
      }

      await prisma.user.update({
        where: { clerkId: id! },
        data: {
          email: primaryEmail,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
      });
    }

    if (eventType === "user.deleted") {
      await prisma.user.delete({
        where: { clerkId: id! },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (dbError) {
    console.error("Error executing database operation from Clerk webhook:", dbError);
    return new Response("Database write failure.", { status: 500 });
  }
}
