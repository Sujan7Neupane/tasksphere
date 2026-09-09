import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { updateCommentSchema } from "../../../schemas/comment.schema";

type CommentProps = {
  params: Promise<{
    commentId: string;
  }>;
};

export async function PUT(request: Request, { params }: CommentProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await params;
    const body = await request.json();

    const validation = updateCommentSchema.safeParse(body);
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
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        task: {
          include: {
            project: true,
          },
        },
      },
    });
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: comment.task.project.workspaceId,
        },
      },
    });
    if (!membership) {
      return NextResponse.json(
        { message: "You are not a member of this workspace" },
        { status: 403 },
      );
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { message: "You can only edit your own comments" },
        { status: 403 },
      );
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
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

    return NextResponse.json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Update comment error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: CommentProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await params;
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        task: {
          include: {
            project: true,
          },
        },
      },
    });
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: comment.task.project.workspaceId,
        },
      },
    });
    if (!membership) {
      return NextResponse.json(
        { message: "You are not a member of this workspace" },
        { status: 403 },
      );
    }

    const canDelete =
      comment.authorId === session.user.id ||
      membership.role === "OWNER" ||
      membership.role === "ADMIN";
    if (!canDelete) {
      return NextResponse.json(
        { message: "You do not have permission to delete this comment" },
        { status: 403 },
      );
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
