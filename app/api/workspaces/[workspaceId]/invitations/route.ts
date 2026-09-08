import { NextResponse } from "next/server";
import crypto from "crypto";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId } = await params;
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

    // Only OWNER and ADMIN can invite
    if (member.role === "MEMBER") {
      return NextResponse.json(
        { message: "You do not have permission to invite members" },
        { status: 403 },
      );
    }

    const { email } = await request.json();
    const normalizedEmail = email.trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    // Check if user is already a workspace member
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User with this email does not exist" },
        { status: 404 },
      );
    }

    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: existingUser.id,
          workspaceId,
        },
      },
    });
    if (existingMember) {
      return NextResponse.json(
        { message: "User is already a member of this workspace" },
        { status: 409 },
      );
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email: normalizedEmail,
        workspaceId,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    if (existingInvitation) {
      return NextResponse.json(
        { message: "User with this email is already invited." },
        { status: 409 },
      );
    }

    // Create a random invitation token
    const token = crypto.randomBytes(32).toString("hex");

    // Invitation expires in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const invitation = await prisma.invitation.create({
      data: {
        email: normalizedEmail,
        token,
        workspaceId,
        invitedById: session.user.id,
        expiresAt,
      },
    });

    const invitationLink = `${process.env.BASE_URL}/user/invitations/${token}`;

    return NextResponse.json(
      {
        message: "User invited successfully",
        invitation: {
          id: invitation.id,
          email: invitation.email,
          // token: invitation.token,
          expiresAt: invitation.expiresAt,
          invitationLink,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create invitation error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

// See all pending invitations by owner
export async function GET(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId } = await params;
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
    if (member.role === "MEMBER") {
      return NextResponse.json(
        {
          message: "You do not have permission to view invitations",
        },
        { status: 403 },
      );
    }

    // Get pending invitations
    const invitations = await prisma.invitation.findMany({
      where: {
        workspaceId,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      workspaceId,
      invitations,
    });
  } catch (error) {
    console.error("Get invitations error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
