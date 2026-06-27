import { prisma } from "../src/lib/db/prisma";
import { Role } from "@prisma/client";

async function main() {
  console.log("Seeding database...");

  // Clean existing tables to prevent duplicate key constraint violations
  await prisma.session.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const user1 = await prisma.user.create({
    data: {
      clerkId: "user_2NxF1234567890",
      email: "john.doe@leadforge.os",
      firstName: "John",
      lastName: "Doe",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      clerkId: "user_2NxG9876543210",
      email: "jane.smith@leadforge.os",
      firstName: "Jane",
      lastName: "Smith",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
    },
  });

  // Create demo organization
  const org = await prisma.organization.create({
    data: {
      clerkOrgId: "org_2NxForg123456",
      name: "Acme Growth Corp",
      slug: "acme-growth",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&h=128&q=80",
    },
  });

  // Link memberships
  await prisma.membership.create({
    data: {
      clerkMemberId: "orgmem_admin123456",
      role: Role.ADMIN,
      userId: user1.id,
      organizationId: org.id,
    },
  });

  await prisma.membership.create({
    data: {
      clerkMemberId: "orgmem_member987654",
      role: Role.MEMBER,
      userId: user2.id,
      organizationId: org.id,
    },
  });

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      action: "organization.created",
      entityType: "organization",
      entityId: org.id,
      userId: user1.id,
      organizationId: org.id,
      metadata: { name: org.name, slug: org.slug },
    },
  });

  // Create sample api key
  await prisma.apiKey.create({
    data: {
      name: "Outreach Production Key",
      keyHash: "6f5b9d3e8a7c1b4e2d8f9a0c2e4b6d8a",
      scopes: ["leads:read", "leads:write"],
      userId: user1.id,
      organizationId: org.id,
    },
  });

  console.log("Seeding complete. Created:");
  console.log(`- 2 Users`);
  console.log(`- 1 Organization`);
  console.log(`- 2 Memberships`);
  console.log(`- 1 Audit Log`);
  console.log(`- 1 API Key`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
