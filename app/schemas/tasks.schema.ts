import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(100, "Task title must be less than 100 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

  dueDate: z.string().optional(),

  assignedToId: z.string().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
