"use client";

import { Message, Conversation } from "@prisma/client";
import { useState, useRef, useEffect, useTransition } from "react";
import { sendMessageAction, completeConversationAction } from "@/app/actions/ai.actions";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatWindowProps {
  conversation: Conversation & { messages: Message[] };
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages, isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending || conversation.status !== "ACTIVE") return;

    const currentMsg = input;
    setInput("");

    startTransition(async () => {
      const res = await sendMessageAction(conversation.id, currentMsg);
      if (!res.success) {
        alert(res.error || "Failed to send message.");
      }
    });
  };

  const handleComplete = () => {
    if (isPending) return;
    startTransition(async () => {
      const res = await completeConversationAction(conversation.id);
      if (!res.success) {
        alert(res.error || "Failed to complete conversation.");
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-white/[0.05] overflow-hidden">
      {/* Thread Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] bg-secondary/20">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-foreground">
            Aria Lead Qualification Thread
          </h3>
        </div>
        {conversation.status === "ACTIVE" && (
          <Button size="sm" variant="outline" className="border-white/[0.08]" onClick={handleComplete} disabled={isPending}>
            <Icon name="Check" className="size-3 mr-1" />
            Complete Session
          </Button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg) => {
          const isAria = msg.sender === "ASSISTANT";
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isAria ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
              <Avatar className="h-7 w-7">
                <AvatarFallback className={`text-[10px] font-bold ${isAria ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {isAria ? "AR" : "US"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className={`p-3 rounded-lg text-sm ${
                  isAria
                    ? "bg-secondary/40 text-foreground border border-white/[0.03]"
                    : "bg-primary/10 text-primary border border-primary/20"
                }`}>
                  {msg.content}
                </div>
                <div className="text-[9px] text-muted-foreground/60 font-mono px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isPending && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                AR
              </AvatarFallback>
            </Avatar>
            <div className="bg-secondary/40 text-muted-foreground border border-white/[0.03] p-3 rounded-lg text-sm flex items-center gap-1">
              <span className="size-1.5 bg-muted-foreground rounded-full animate-bounce delay-100" />
              <span className="size-1.5 bg-muted-foreground rounded-full animate-bounce delay-200" />
              <span className="size-1.5 bg-muted-foreground rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Inputs Form */}
      <div className="p-3 border-t border-white/[0.05] bg-secondary/10">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPending || conversation.status !== "ACTIVE"}
            placeholder={
              conversation.status === "ACTIVE"
                ? "Send message to Aria..."
                : "This conversation is completed."
            }
            className="flex-1 h-9 px-3 rounded-lg border border-white/[0.05] bg-secondary/30 text-sm text-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
          />
          <Button type="submit" size="sm" disabled={isPending || !input.trim() || conversation.status !== "ACTIVE"}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
