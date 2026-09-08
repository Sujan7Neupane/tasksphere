import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        email: user.email.toLowerCase(),
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
        token: true,
        expiresAt: true,
        createdAt: true,

        workspace: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },

        invitedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      invitations,
    });
  } catch (error) {
    console.error("Get user invitations error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
