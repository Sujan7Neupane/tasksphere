import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;

    const invitation = await prisma.invitation.findUnique({
      where: {
        token,
      },
    });
    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not found" },
        { status: 404 },
      );
    }
    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { message: "This invitation is no longer valid" },
        { status: 409 },
      );
    }
    if (invitation.expiresAt < new Date()) {
      await prisma.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "EXPIRED",
        },
      });
      return NextResponse.json(
        { message: "This invitation has expired" },
        { status: 410 },
      );
    }

    // Check invitation email matches logged-in user
    if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        {
          message: "Invalid invitations or invitations expired.",
        },
        { status: 403 },
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: invitation.workspaceId,
        },
      },
    });
    if (existingMember) {
      return NextResponse.json(
        { message: "You are already a member of this workspace" },
        { status: 409 },
      );
    }

    // Add user to workspace
    const member = await prisma.workspaceMember.create({
      data: {
        userId: session.user.id,
        workspaceId: invitation.workspaceId,
        role: "MEMBER",
      },
    });

    const acceptedInvitation = await prisma.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    return NextResponse.json({
      message: "Invitation accepted successfully",
      member,
      invitation: {
        id: acceptedInvitation.id,
        status: acceptedInvitation.status,
      },
    });
  } catch (error) {
    console.error("Accept invitation error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
