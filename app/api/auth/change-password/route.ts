import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import prisma from "@/prisma/client";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();
    // console.log(currentPassword);
    // console.log(newPassword);

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required." },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        password: true,
      },
    });
    // console.log(user);

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    // console.log(passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    // console.log(updated);

    return NextResponse.json(
      { message: "Password changed successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Change password error:", error);

    return NextResponse.json(
      { message: "Something went wrong while changing password." },
      { status: 500 },
    );
  }
}
