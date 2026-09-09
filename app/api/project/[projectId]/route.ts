import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { updateProjectSchema } from "../../../schemas/project.schema";

type ProjectParams = {
  params: Promise<{
    projectId: string;
  }>;
};

// single project
export async function GET(request: Request, { params }: ProjectParams) {
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

    return NextResponse.json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

// UPDATE project
export async function PUT(request: Request, { params }: ProjectParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await request.json();

    const validation = updateProjectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, description } = validation.data;
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

    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You do not have permission to update projects" },
        { status: 403 },
      );
    }

    const existingProject = await prisma.project.findFirst({
      where: {
        workspaceId: project.workspaceId,
        name,
        NOT: {
          id: projectId,
        },
      },
    });
    if (existingProject) {
      return NextResponse.json(
        { message: "A project with this name already exists" },
        { status: 409 },
      );
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

// DELETE project
export async function DELETE(request: Request, { params }: ProjectParams) {
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

    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You do not have permission to delete projects" },
        { status: 403 },
      );
    }

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
