import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";

type NotificationProps = {
  params: Promise<{
    notificationId: string;
  }>;
};

export async function PATCH(request: Request, { params }: NotificationProps) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { notificationId } = await params;

    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found." },
        { status: 404 },
      );
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You do not have permission to update this notification." },
        { status: 403 },
      );
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      message: "Notification marked as read.",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 },
    );
  }
}
