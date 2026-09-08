import { z } from "zod";

export const invitationSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

export type InvitationFormData = z.infer<typeof invitationSchema>;
