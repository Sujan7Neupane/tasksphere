import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "../../../prisma/client";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.platformRole === "ADMIN") {
      return NextResponse.json(
        { message: "Admins cannot create workspaces" },
        { status: 403 },
      );
    }

    const { name, description } = await request.json();
    if (!name || !description) {
      return NextResponse.json(
        { message: "These fields are required" },
        { status: 400 },
      );
    }

    const existingWorkspace = await prisma.workspaceMember.findFirst({
      where: {
        userId: session.user.id,
        role: "OWNER",
        workspace: {
          name,
        },
      },
    });

    if (existingWorkspace) {
      return NextResponse.json(
        { message: "You already have a workspace with this name" },
        { status: 409 },
      );
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
      },
    });

    // NOTE: jasle workspace create -> tei owner qutomatically
    await prisma.workspaceMember.create({
      data: {
        userId: session.user.id,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });

    return NextResponse.json(
      {
        message: "Workspace created successfully",
        workspace,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create workspace error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

// specific user's workspaces
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const memberships = await prisma.workspaceMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        workspace: true,
      },
    });

    // formatiing workspace in array of object
    const workspaces = memberships.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      description: membership.workspace.description,
      role: membership.role,
      joinedAt: membership.joinedAt,
    }));

    return NextResponse.json({
      userId: session.user.id,
      workspaces,
    });
  } catch (error) {
    console.error("Get workspaces error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
