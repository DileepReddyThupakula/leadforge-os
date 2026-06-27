"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Company, Contact, Lead, LeadStatus, Priority } from "@prisma/client";
import { leadSchema, LeadInput } from "@/lib/validation/lead";
import { createLeadAction, updateLeadAction } from "@/app/actions/lead.actions";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";
import { Icon } from "@/components/shared/Icon";

interface LeadFormProps {
  initialData?: Lead | null;
  companies: Company[];
  contacts: Contact[];
}

export function LeadForm({ initialData, companies, contacts }: LeadFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      title: initialData?.title || "",
      companyId: initialData?.companyId || "",
      contactId: initialData?.contactId || "",
      status: initialData?.status || LeadStatus.NEW,
      priority: initialData?.priority || Priority.MEDIUM,
      value: initialData?.value ? Number(initialData.value) : null,
      currency: initialData?.currency || "USD",
      sourceId: initialData?.sourceId || "",
      ownerId: initialData?.ownerId || "",
    },
  });

  const onSubmit = (data: LeadInput) => {
    startTransition(async () => {
      let res;
      if (initialData) {
        res = await updateLeadAction(initialData.id, data);
      } else {
        res = await createLeadAction(data);
      }

      if (res.success) {
        router.push("/dashboard/leads");
      } else {
        alert(res.error || "Something went wrong.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GlassCard className="max-w-2xl space-y-6">
        <div className="space-y-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-xs font-semibold text-muted-foreground">
              Opportunity Title *
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              placeholder="E.g. Enterprise CRM Deal"
              className="h-9 px-3 rounded-lg border border-white/[0.05] bg-secondary/30 text-sm text-foreground focus:outline-none focus:border-primary/50"
            />
            {errors.title && (
              <span className="text-xs text-destructive">{errors.title.message}</span>
            )}
          </div>

          {/* Company Selection */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="companyId" className="text-xs font-semibold text-muted-foreground">
              Company *
            </label>
            <select
              id="companyId"
              {...register("companyId")}
              className="h-9 px-3 rounded-lg border border-white/[0.05] bg-secondary/30 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {errors.companyId && (
              <span className="text-xs text-destructive">{errors.companyId.message}</span>
            )}
          </div>

          {/* Contact Selection */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contactId" className="text-xs font-semibold text-muted-foreground">
              Primary Contact (Optional)
            </label>
            <select
              id="contactId"
              {...register("contactId")}
              className="h-9 px-3 rounded-lg border border-white/[0.05] bg-secondary/30 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">Select Contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Status & Priority Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-xs font-semibold text-muted-foreground">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="h-9 px-3 rounded-lg border border-white/[0.05] bg-secondary/30 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {Object.values(LeadStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="priority" className="text-xs font-semibold text-muted-foreground">
                Priority
              </label>
              <select
                id="priority"
                {...register("priority")}
                className="h-9 px-3 rounded-lg border border-white/[0.05] bg-secondary/30 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {Object.values(Priority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Value & Currency Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="value" className="text-xs font-semibold text-muted-foreground">
                Estimated Value
              </label>
              <input
                id="value"
                type="number"
                step="0.01"
                {...register("value", { valueAsNumber: true })}
                placeholder="E.g. 50000"
                className="h-9 px-3 rounded-lg border border-white/[0.05] bg-secondary/30 text-sm text-foreground focus:outline-none focus:border-primary/50"
              />
              {errors.value && (
                <span className="text-xs text-destructive">{errors.value.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="currency" className="text-xs font-semibold text-muted-foreground">
                Currency
              </label>
              <input
                id="currency"
                type="text"
                {...register("currency")}
                placeholder="USD"
                className="h-9 px-3 rounded-lg border border-white/[0.05] bg-secondary/30 text-sm text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.05]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/leads")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            <Icon name="Check" className="size-4 mr-2" />
            {isPending ? "Saving..." : initialData ? "Update Lead" : "Create Lead"}
          </Button>
        </div>
      </GlassCard>
    </form>
  );
}
