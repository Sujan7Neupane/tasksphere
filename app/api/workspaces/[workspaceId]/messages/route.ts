import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().trim().min(1, "Message cannot be empty."),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { workspaceId } = await params;

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { message: "You are not a member of this workspace." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const message = await prisma.message.create({
      data: {
        content: result.data.content,
        workspaceId,
        senderId: session.user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Message sent successfully.",
        data: message,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create message error:", error);

    return NextResponse.json(
      { message: "Failed to send message." },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { workspaceId } = await params;

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        userId: session.user.id,
        workspaceId,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { message: "You are not a member of this workspace." },
        { status: 403 },
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return NextResponse.json(
      { message: "Failed to get messages." },
      { status: 500 },
    );
  }
}
