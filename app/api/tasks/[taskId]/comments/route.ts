import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { createCommentSchema } from "../../../../schemas/comment.schema";

type CommentsProps = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function POST(request: Request, { params }: CommentsProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    const body = await request.json();

    const validation = createCommentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { content } = validation.data;
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        project: true,
      },
    });
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: task.project.workspaceId,
        },
      },
    });
    if (!membership) {
      return NextResponse.json(
        { message: "You are not a member of this workspace" },
        { status: 403 },
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Comment created successfully",
        comment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create comment error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request, { params }: CommentsProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        project: true,
      },
    });
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: task.project.workspaceId,
        },
      },
    });
    if (!membership) {
      return NextResponse.json(
        { message: "You are not a member of this workspace" },
        { status: 403 },
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        taskId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
