import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { UserRepository } from "@/lib/db/repositories/user.repository";
import { OrganizationRepository } from "@/lib/db/repositories/organization.repository";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

function mapClerkRole(clerkRole: string): Role {
  const roleLower = clerkRole.toLowerCase();
  if (roleLower.includes("admin")) return Role.ADMIN;
  if (roleLower.includes("owner")) return Role.OWNER;
  if (roleLower.includes("guest")) return Role.GUEST;
  return Role.MEMBER;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("CLERK_WEBHOOK_SECRET environment variable is missing.", {
      status: 500,
    });
  }

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers.", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

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

  const eventType = evt.type;

  try {
    // === USER EVENTS ===
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses?.[0]?.email_address;
      if (!primaryEmail) {
        return new Response("User has no email address.", { status: 400 });
      }
      await UserRepository.create({
        clerkId: id,
        email: primaryEmail,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
      });
    }

    else if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses?.[0]?.email_address;
      if (!primaryEmail) {
        return new Response("User has no email address.", { status: 400 });
      }
      await UserRepository.updateByClerkId(id, {
        email: primaryEmail,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
      });
    }

    else if (eventType === "user.deleted") {
      const { id } = evt.data;
      if (id) {
        await UserRepository.deleteByClerkId(id);
      }
    }

    // === ORGANIZATION EVENTS ===
    else if (eventType === "organization.created") {
      const { id, name, slug, image_url } = evt.data;
      await OrganizationRepository.create({
        clerkOrgId: id,
        name: name,
        slug: slug || id,
        imageUrl: image_url || null,
      });
    }

    else if (eventType === "organization.updated") {
      const { id, name, slug, image_url } = evt.data;
      await OrganizationRepository.updateByClerkOrgId(id, {
        name: name,
        slug: slug || undefined,
        imageUrl: image_url || null,
      });
    }

    else if (eventType === "organization.deleted") {
      const { id } = evt.data;
      if (id) {
        await OrganizationRepository.deleteByClerkOrgId(id);
      }
    }

    // === MEMBERSHIP EVENTS ===
    else if (eventType === "organizationMembership.created") {
      const { id: clerkMemberId, role, public_user_data, organization } = evt.data;
      const clerkUserId = public_user_data.user_id;
      const clerkOrgId = organization.id;

      const user = await UserRepository.findByClerkId(clerkUserId);
      const org = await OrganizationRepository.findByClerkOrgId(clerkOrgId);

      if (user && org) {
        await OrganizationRepository.createMembership({
          clerkMemberId,
          role: mapClerkRole(role),
          userId: user.id,
          organizationId: org.id,
        });
      }
    }

    else if (eventType === "organizationMembership.updated") {
      const { id: clerkMemberId, role } = evt.data;
      await OrganizationRepository.updateMembership(clerkMemberId, mapClerkRole(role));
    }

    else if (eventType === "organizationMembership.deleted") {
      const { id: clerkMemberId } = evt.data;
      await OrganizationRepository.deleteMembership(clerkMemberId);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (dbError) {
    console.error("Error executing database operation from Clerk webhook:", dbError);
    return new Response("Database write failure.", { status: 500 });
  }
}
