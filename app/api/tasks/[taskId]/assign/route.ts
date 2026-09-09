import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { assignTaskSchema } from "../../../../schemas/task.schemas";

type AssignProps = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function PATCH(request: Request, { params }: AssignProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    const body = await request.json();

    const validation = assignTaskSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { assignedToId } = validation.data;
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

    if (assignedToId) {
      const assignedMember = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: assignedToId,
            workspaceId: task.project.workspaceId,
          },
        },
      });
      if (!assignedMember) {
        return NextResponse.json(
          {
            message: "Assigned user is not a member of this workspace",
          },
          { status: 400 },
        );
      }
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assignedToId,
      },
    });

    return NextResponse.json({
      message: assignedToId
        ? "Task assigned successfully"
        : "Task unassigned successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Assign task error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
