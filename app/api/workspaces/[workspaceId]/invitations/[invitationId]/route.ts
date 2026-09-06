import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      workspaceId: string;
      invitationId: string;
    }>;
  },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId, invitationId } = await params;
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });
    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 },
      );
    }

    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });
    if (!member) {
      return NextResponse.json(
        { message: "You are not a member of this workspace" },
        { status: 403 },
      );
    }

    // Only OWNER and ADMIN can cancel invitations
    if (member.role === "MEMBER") {
      return NextResponse.json(
        { message: "You do not have permission to cancel invitations" },
        { status: 403 },
      );
    }

    const invitation = await prisma.invitation.findFirst({
      where: {
        id: invitationId,
        workspaceId,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not found" },
        { status: 404 },
      );
    }

    // Check if invitation is still pending
    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { message: "This invitation is no longer pending" },
        { status: 409 },
      );
    }

    const cancelledInvitation = await prisma.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({
      message: "Invitation cancelled successfully",
      invitation: cancelledInvitation,
    });
  } catch (error) {
    console.error("Cancel invitation error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
