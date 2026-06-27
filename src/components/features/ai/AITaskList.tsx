"use client";

import { AITask } from "@prisma/client";
import { useTransition } from "react";
import { completeTaskAction } from "@/app/actions/ai.actions";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";

interface AITaskListProps {
  tasks: AITask[];
}

export function AITaskList({ tasks }: AITaskListProps) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = (id: string) => {
    startTransition(async () => {
      const res = await completeTaskAction(id);
      if (!res.success) {
        alert(res.error || "Failed to complete task.");
      }
    });
  };

  if (tasks.length === 0) {
    return <p className="text-xs text-muted-foreground">All AI tasks completed! Nice work.</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
          <div className="space-y-1">
            <h5 className="text-xs font-semibold text-foreground">{task.title}</h5>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{task.description}</p>
            <span className="inline-block text-[9px] font-mono text-muted-foreground/60">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => handleComplete(task.id)}
            disabled={isPending}
            className="h-7 w-7 text-primary hover:bg-primary/10"
          >
            <Icon name="Check" className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
