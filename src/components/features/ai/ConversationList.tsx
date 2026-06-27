"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, LeadQualification } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import { createConversationAction } from "@/app/actions/ai.actions";

interface ConversationWithRelations extends Conversation {
  messages: Message[];
  leadQualifications: LeadQualification[];
}

interface ConversationListProps {
  conversations: ConversationWithRelations[];
  selectedId?: string | null;
}

export function ConversationList({ conversations, selectedId }: ConversationListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNewChat = () => {
    startTransition(async () => {
      const res = await createConversationAction();
      if (res.success && res.conversationId) {
        router.push(`/dashboard/ai?chat=${res.conversationId}`);
      } else {
        alert(res.error || "Failed to start chat.");
      }
    });
  };

  const activeChats = conversations.filter((c) => c.status === "ACTIVE");
  const completedChats = conversations.filter((c) => c.status === "COMPLETED");

  const renderChatItem = (chat: ConversationWithRelations) => {
    const isSelected = chat.id === selectedId;
    const qualification = chat.leadQualifications[0];
    const intent = qualification?.intent; // HOT, WARM, COLD
    const latestMessage = chat.messages[chat.messages.length - 1]?.content || "Empty chat";

    const intentBadges: Record<string, string> = {
      HOT: "bg-red-500/10 text-red-400 border-red-500/20",
      WARM: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      COLD: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };

    return (
      <Link
        key={chat.id}
        href={`/dashboard/ai?chat=${chat.id}`}
        className={`flex flex-col gap-1.5 p-3 rounded-lg border text-left transition-all ${
          isSelected
            ? "border-primary/30 bg-primary/5 text-foreground"
            : "border-white/[0.04] bg-white/[0.01] text-muted-foreground hover:bg-white/[0.02] hover:text-foreground"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono font-semibold truncate max-w-[120px]">
            {qualification?.name || `Chat #${chat.id.slice(0, 8)}`}
          </span>
          {intent && (
            <span className={`inline-flex items-center rounded px-1.5 py-0.25 text-[10px] font-bold border ${intentBadges[intent]}`}>
              {intent}
            </span>
          )}
        </div>
        <p className="text-xs truncate text-muted-foreground">{latestMessage}</p>
        <span className="text-[10px] text-muted-foreground/60 font-mono">
          {new Date(chat.createdAt).toLocaleDateString()}
        </span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full gap-4 border-r border-white/[0.05] pr-4">
      <Button size="sm" onClick={handleNewChat} disabled={isPending} className="w-full justify-center">
        <Icon name="Plus" className="size-4 mr-2" />
        New AI Session
      </Button>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Active chats */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
            Active Chats ({activeChats.length})
          </h4>
          <div className="flex flex-col gap-2">
            {activeChats.length === 0 ? (
              <span className="text-xs text-muted-foreground/60 pl-1">No active AI sessions.</span>
            ) : (
              activeChats.map(renderChatItem)
            )}
          </div>
        </div>

        {/* Completed chats */}
        <div className="space-y-2 pt-2 border-t border-white/[0.04]">
          <h4 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
            Completed ({completedChats.length})
          </h4>
          <div className="flex flex-col gap-2">
            {completedChats.length === 0 ? (
              <span className="text-xs text-muted-foreground/60 pl-1">No completed sessions.</span>
            ) : (
              completedChats.map(renderChatItem)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
