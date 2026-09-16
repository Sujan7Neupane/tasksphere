import prisma from "@/prisma/client";
import { NotificationType } from "../generated/prisma/enums";

interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  message: string;
  relatedId?: string;
}

export const createNotification = async ({
  userId,
  type,
  message,
  relatedId,
}: CreateNotificationData) => {
  return prisma.notification.create({
    data: {
      userId,
      type,
      message,
      relatedId,
    },
  });
};
