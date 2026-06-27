import { prisma } from "../prisma";
import { handleDatabaseError } from "../errors";
import { Conversation, Message, LeadQualification, Prisma } from "@prisma/client";
import { QualificationData } from "@/services/ai/gemini.service";
import { CompanyRepository } from "./company.repository";
import { ContactRepository } from "./contact.repository";
import { LeadRepository } from "./lead.repository";

export type ConversationWithRelations = Prisma.ConversationGetPayload<{
  include: {
    messages: { orderBy: { createdAt: "asc" } };
    leadQualifications: { orderBy: { createdAt: "desc" } };
  };
}>;

export class ConversationRepository {
  static async create(organizationId: string): Promise<Conversation> {
    try {
      return await prisma.conversation.create({
        data: {
          organizationId,
          status: "ACTIVE",
        },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findById(organizationId: string, id: string): Promise<ConversationWithRelations | null> {
    try {
      return await prisma.conversation.findFirst({
        where: { id, organizationId },
        include: {
          messages: { orderBy: { createdAt: "asc" } },
          leadQualifications: { orderBy: { createdAt: "desc" } },
        },
      }) as ConversationWithRelations | null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async findMany(organizationId: string): Promise<ConversationWithRelations[]> {
    try {
      return await prisma.conversation.findMany({
        where: { organizationId },
        include: {
          messages: { orderBy: { createdAt: "asc" } },
          leadQualifications: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
      }) as ConversationWithRelations[];
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async addMessage(
    organizationId: string,
    conversationId: string,
    sender: "USER" | "ASSISTANT" | "SYSTEM",
    content: string
  ): Promise<Message> {
    try {
      // Security bound verify
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, organizationId },
      });
      if (!conversation) {
        throw new Error("Conversation not found or organization mismatch.");
      }

      return await prisma.message.create({
        data: {
          conversationId,
          sender,
          content,
        },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async saveQualification(
    organizationId: string,
    conversationId: string,
    data: QualificationData
  ): Promise<LeadQualification> {
    try {
      // Security check
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, organizationId },
      });
      if (!conversation) {
        throw new Error("Conversation not found or organization mismatch.");
      }

      // Check if qualification record already exists
      const existing = await prisma.leadQualification.findFirst({
        where: { conversationId, organizationId },
      });

      const budgetVal = data.budget !== null && data.budget !== undefined ? new Prisma.Decimal(data.budget) : null;

      let qualRecord: LeadQualification;

      if (existing) {
        qualRecord = await prisma.leadQualification.update({
          where: { id: existing.id },
          data: {
            propertyType: data.propertyType || existing.propertyType,
            budget: budgetVal || existing.budget,
            location: data.location || existing.location,
            timeline: data.timeline || existing.timeline,
            financing: data.financing || existing.financing,
            purpose: data.purpose || existing.purpose,
            name: data.name || existing.name,
            phone: data.phone || existing.phone,
            email: data.email || existing.email,
            score: data.score !== undefined ? data.score : existing.score,
            summary: data.summary || existing.summary,
            intent: data.intent || existing.intent,
            recommendedAction: data.recommendedAction || existing.recommendedAction,
          },
        });
      } else {
        qualRecord = await prisma.leadQualification.create({
          data: {
            organizationId,
            conversationId,
            propertyType: data.propertyType || null,
            budget: budgetVal,
            location: data.location || null,
            timeline: data.timeline || null,
            financing: data.financing || null,
            purpose: data.purpose || null,
            name: data.name || null,
            phone: data.phone || null,
            email: data.email || null,
            score: data.score || null,
            summary: data.summary || null,
            intent: data.intent || null,
            recommendedAction: data.recommendedAction || null,
          },
        });
      }

      // Auto Lead Sync triggers if fully qualified
      if (data.isFullyQualified && data.name && (data.email || data.phone)) {
        await this.syncLeadFromQualification(organizationId, conversationId, data);
      }

      return qualRecord;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async completeConversation(organizationId: string, conversationId: string): Promise<Conversation> {
    try {
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, organizationId },
      });
      if (!conversation) {
        throw new Error("Conversation not found or organization mismatch.");
      }

      return await prisma.conversation.update({
        where: { id: conversationId },
        data: { status: "COMPLETED" },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  private static async syncLeadFromQualification(
    organizationId: string,
    conversationId: string,
    data: QualificationData
  ) {
    try {
      const name = data.name || "Qualified Buyer";
      const email = data.email || "";
      const phone = data.phone || "";

      // 1. Create or Find Company account for buyer
      const companyName = `${name}'s Household`;
      let company = await prisma.company.findFirst({
        where: { name: companyName, organizationId },
      });
      if (!company) {
        company = await CompanyRepository.create(organizationId, {
          name: companyName,
          industry: "Residential Real Estate",
        });
      }

      // 2. Create or Find Contact
      const [firstName, ...lastNameParts] = name.split(" ");
      const lastName = lastNameParts.join(" ") || "Buyer";
      let contact = await prisma.contact.findFirst({
        where: {
          organizationId,
          companyId: company.id,
          OR: [
            ...(email ? [{ email }] : []),
            ...(phone ? [{ phone }] : []),
          ],
        },
      });
      if (!contact) {
        contact = await ContactRepository.create(organizationId, {
          companyId: company.id,
          firstName,
          lastName,
          email: email || null,
          phone: phone || null,
        });
      }

      // 3. Check if Lead Source exists
      let leadSource = await prisma.leadSource.findFirst({
        where: { name: "AI Sales Employee", organizationId },
      });
      if (!leadSource) {
        leadSource = await prisma.leadSource.create({
          data: {
            name: "AI Sales Employee",
            organizationId,
          },
        });
      }

      // 4. Create or Update Lead
      const leadTitle = `${name} - AI Qualified Opportunity`;
      const existingLead = await prisma.lead.findFirst({
        where: { contactId: contact.id, organizationId },
      });

      const budgetVal = data.budget !== null && data.budget !== undefined ? new Prisma.Decimal(data.budget) : null;

      if (existingLead) {
        const updatedLead = await LeadRepository.update(organizationId, existingLead.id, {
          title: leadTitle,
          companyId: company.id,
          contactId: contact.id,
          status: "QUALIFIED",
          value: budgetVal ? Number(budgetVal) : null,
          sourceId: leadSource.id,
        });

        // Link conversation to lead
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { leadId: updatedLead.id },
        });
      } else {
        const newLead = await LeadRepository.create(organizationId, {
          title: leadTitle,
          companyId: company.id,
          contactId: contact.id,
          status: "QUALIFIED",
          priority: data.intent === "HOT" ? "HIGH" : "MEDIUM",
          value: budgetVal ? Number(budgetVal) : null,
          sourceId: leadSource.id,
        });

        // Link conversation to lead
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { leadId: newLead.id },
        });
      }
    } catch (error) {
      console.error("Auto Lead Sync failed:", error);
    }
  }
}
