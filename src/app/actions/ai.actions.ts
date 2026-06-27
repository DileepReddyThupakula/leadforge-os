"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ConversationRepository } from "@/lib/db/repositories/conversation.repository";
import { GeminiService } from "@/services/ai/gemini.service";
import { prisma } from "@/lib/db/prisma";

export async function createConversationAction() {
  const { orgId } = await auth();
  if (!orgId) {
    return { success: false, error: "Active organization required." };
  }

  try {
    const conversation = await ConversationRepository.create(orgId);
    
    // Seed initial welcome message from Aria
    const initialWelcome = "Hi there! I'm Aria, your real estate assistant. Are you looking to buy a property soon? If so, what type of home are you thinking about?";
    await ConversationRepository.addMessage(orgId, conversation.id, "ASSISTANT", initialWelcome);
    
    revalidatePath("/dashboard/ai");
    return { success: true, conversationId: conversation.id };
  } catch (error) {
    console.error("Failed to create conversation:", error);
    const message = error instanceof Error ? error.message : "Failed to create conversation.";
    return { success: false, error: message };
  }
}

export async function sendMessageAction(conversationId: string, content: string) {
  const { orgId } = await auth();
  if (!orgId) {
    return { success: false, error: "Active organization required." };
  }

  try {
    // 1. Add user message
    await ConversationRepository.addMessage(orgId, conversationId, "USER", content);

    // 2. Retrieve history for Gemini prompt context
    const fullConversation = await ConversationRepository.findById(orgId, conversationId);
    if (!fullConversation) {
      return { success: false, error: "Conversation not found." };
    }

    const messagesMapped = fullConversation.messages.map((m) => ({
      sender: m.sender,
      content: m.content,
    }));

    // 3. Generate Aria's response
    const ariaReply = await GeminiService.generateResponse(messagesMapped);

    // 4. Save Aria's message
    await ConversationRepository.addMessage(orgId, conversationId, "ASSISTANT", ariaReply);

    // 5. Query full updated message list (with Aria's new message) for data extraction
    const updatedMessages = [...messagesMapped, { sender: "ASSISTANT", content: ariaReply }];

    // 6. Perform qualification data extraction
    const extractedData = await GeminiService.extractQualification(updatedMessages);

    // 7. Save qualification data (automatically triggers lead sync if fully qualified)
    await ConversationRepository.saveQualification(orgId, conversationId, extractedData);

    // 8. Run AI Decision Engine (generate insights, scorecards, rationales, and CRM tasks)
    const insights = await GeminiService.generateInsights(updatedMessages);

    // 9. Save Qualification Metric (real-time completion/confidence weights)
    await prisma.qualificationMetric.upsert({
      where: { conversationId },
      update: {
        budgetConfidence: insights.budgetConfidence,
        timelineConfidence: insights.timelineConfidence,
        contactCompleteness: insights.contactCompleteness,
        completionPercentage: insights.completionPercentage,
      },
      create: {
        organizationId: orgId,
        conversationId,
        budgetConfidence: insights.budgetConfidence,
        timelineConfidence: insights.timelineConfidence,
        contactCompleteness: insights.contactCompleteness,
        completionPercentage: insights.completionPercentage,
      },
    });

    // Find linked lead id if any
    const latestConv = await prisma.conversation.findFirst({
      where: { id: conversationId, organizationId: orgId },
    });
    const leadId = latestConv?.leadId || null;

    // 10. Save AI Recommendation (with risk flags and explainability rationale logs)
    await prisma.aIRecommendation.create({
      data: {
        organizationId: orgId,
        conversationId,
        leadId,
        action: insights.recommendedAction,
        reason: insights.reason,
        priority: insights.priority,
        riskFlags: insights.riskFlags,
      },
    });

    // 11. Clear previous pending tasks for this chat to avoid duplicates, then create new suggestions
    await prisma.aITask.deleteMany({
      where: { conversationId, status: "PENDING", organizationId: orgId },
    });

    for (const task of insights.suggestedTasks) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + task.dueDays);

      await prisma.aITask.create({
        data: {
          organizationId: orgId,
          conversationId,
          leadId,
          title: task.title,
          description: task.description,
          dueDate,
          status: "PENDING",
        },
      });
    }

    revalidatePath("/dashboard/ai");
    revalidatePath("/dashboard/ai/insights");
    return { success: true };
  } catch (error) {
    console.error("Failed to process message:", error);
    const message = error instanceof Error ? error.message : "Failed to send message.";
    return { success: false, error: message };
  }
}

export async function completeConversationAction(conversationId: string) {
  const { orgId } = await auth();
  if (!orgId) {
    return { success: false, error: "Active organization required." };
  }

  try {
    await ConversationRepository.completeConversation(orgId, conversationId);
    revalidatePath("/dashboard/ai");
    return { success: true };
  } catch (error) {
    console.error("Failed to complete conversation:", error);
    const message = error instanceof Error ? error.message : "Failed to complete conversation.";
    return { success: false, error: message };
  }
}

export async function completeTaskAction(taskId: string) {
  const { orgId } = await auth();
  if (!orgId) {
    return { success: false, error: "Active organization required." };
  }

  try {
    await prisma.aITask.update({
      where: { id: taskId, organizationId: orgId },
      data: { status: "COMPLETED" },
    });
    revalidatePath("/dashboard/ai/insights");
    return { success: true };
  } catch (error) {
    console.error("Failed to complete task:", error);
    const message = error instanceof Error ? error.message : "Failed to complete task.";
    return { success: false, error: message };
  }
}
