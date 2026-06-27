import { z } from "zod";
import { LeadStatus, Priority } from "@prisma/client";

export const leadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  companyId: z.string().min(1, "Company selection is required"),
  contactId: z.string().nullable().optional(),
  status: z.nativeEnum(LeadStatus),
  priority: z.nativeEnum(Priority),
  value: z.number().nonnegative("Value must be a positive number").nullable().optional(),
  currency: z.string().min(1),
  sourceId: z.string().nullable().optional(),
  ownerId: z.string().nullable().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
