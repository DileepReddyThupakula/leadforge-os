import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ConversationRepository } from "@/lib/db/repositories/conversation.repository";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConversationList } from "@/components/features/ai/ConversationList";
import { ChatWindow } from "@/components/features/ai/ChatWindow";
import { QualificationPanel } from "@/components/features/ai/QualificationPanel";
import { GlassCard } from "@/components/shared/GlassCard";
import { Icon } from "@/components/shared/Icon";

interface AIPageProps {
  searchParams: Promise<{
    chat?: string;
  }>;
}

export default async function AIPage({ searchParams }: AIPageProps) {
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/onboarding");
  }

  const params = await searchParams;
  const selectedChatId = params.chat;

  // Retrieve all conversations for this organization
  const conversations = await ConversationRepository.findMany(orgId);

  // Find the selected conversation thread
  const activeConversation = selectedChatId
    ? conversations.find((c) => c.id === selectedChatId)
    : null;

  return (
    <PageContainer>
      <PageHeader
        title="AI Sales Employee"
        description="Monitor Aria qualifying real estate buyers, generating intent scores, and syncing leads."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Chat History Sidebar */}
        <div className="md:col-span-1 h-full">
          <ConversationList conversations={conversations} selectedId={selectedChatId} />
        </div>

        {/* Conversation Thread & Qualification Extract */}
        <div className="md:col-span-3 h-full">
          {activeConversation ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Chat Thread */}
              <div className="lg:col-span-2 h-full">
                <ChatWindow conversation={activeConversation} />
              </div>

              {/* Real-time Extraction Card */}
              <div className="lg:col-span-1 overflow-y-auto h-full pr-1">
                <QualificationPanel qualification={activeConversation.leadQualifications[0]} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <GlassCard className="max-w-md p-8 text-center border-dashed border-white/[0.08]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 mx-auto mb-4 animate-pulse">
                  <Icon name="Cpu" className="size-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Welcome to LeadForge AI</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Aria qualifies real estate leads by gathering timeline, budget, financing, and contact info naturally.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Select an active chat session from the sidebar or start a new AI conversation to test the flow.
                </p>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
