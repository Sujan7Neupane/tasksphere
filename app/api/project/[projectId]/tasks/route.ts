import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { createTaskSchema } from "../../../../schemas/task.schemas";

type TaskProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function POST(request: Request, { params }: TaskProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await request.json();

    const validation = createTaskSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { title, description, priority, dueDate, assignedToId } =
      validation.data;
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: project.workspaceId,
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
            workspaceId: project.workspaceId,
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

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedToId,
        createdById: session.user.id,
        projectId,
      },
    });

    return NextResponse.json(
      {
        message: "Task created successfully",
        task,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create task error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request, { params }: TaskProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: project.workspaceId,
        },
      },
    });
    if (!membership) {
      return NextResponse.json(
        { message: "You are not a member of this workspace" },
        { status: 403 },
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
