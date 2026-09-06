import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "../../../../../../prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string; userId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId, userId } = await params;
    const currentMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });

    if (!currentMember) {
      return NextResponse.json(
        { message: "You are not a member of this workspace" },
        { status: 403 },
      );
    }

    if (currentMember.role === "MEMBER") {
      return NextResponse.json(
        { message: "You do not have permission to update member roles" },
        { status: 403 },
      );
    }

    if (userId === session.user.id) {
      return NextResponse.json(
        { message: "You cannot change your own role" },
        { status: 403 },
      );
    }

    // Find the target member to update
    const targetMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!targetMember) {
      return NextResponse.json(
        { message: "Member not found in this workspace" },
        { status: 404 },
      );
    }

    // other user cannot change admin role
    if (targetMember.role === "OWNER") {
      return NextResponse.json(
        { message: "The workspace owner's role cannot be changed" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const { role } = body;

    // Only ADMIN and MEMBER are valid target roles
    if (role !== "ADMIN" && role !== "MEMBER") {
      return NextResponse.json(
        { message: "Role must be ADMIN or MEMBER" },
        { status: 400 },
      );
    }

    const updatedMember = await prisma.workspaceMember.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: {
        role,
      },
    });

    return NextResponse.json({
      message: "Member role updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Update member role error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string; userId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId, userId } = await params;

    const currentMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });

    if (!currentMember) {
      return NextResponse.json(
        { message: "You are not a member of this workspace" },
        { status: 403 },
      );
    }

    if (currentMember.role === "MEMBER") {
      return NextResponse.json(
        { message: "You do not have permission to remove members" },
        { status: 403 },
      );
    }

    // Prevent removing OWNER
    if (userId === session.user.id) {
      return NextResponse.json(
        { message: "You cannot remove yourself from the workspace" },
        { status: 403 },
      );
    }

    const targetMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!targetMember) {
      return NextResponse.json(
        { message: "Member not found in this workspace" },
        { status: 404 },
      );
    }

    if (targetMember.role === "OWNER") {
      return NextResponse.json(
        { message: "The workspace owner cannot be removed" },
        { status: 403 },
      );
    }

    // ADMIN can only remove MEMBER
    if (currentMember.role === "ADMIN" && targetMember.role === "ADMIN") {
      return NextResponse.json(
        { message: "Admins cannot remove other admins" },
        { status: 403 },
      );
    }

    await prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    return NextResponse.json({
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Delete workspace member error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
