import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Workspace description is required")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;
