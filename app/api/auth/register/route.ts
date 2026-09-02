import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json(
        { message: "These fields are required." },
        { status: 400 },
      );

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return NextResponse.json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const registeredUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        platformRole: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "User registered.", registeredUser },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Something went wrong while registering the user." },
      { status: 500 },
    );
  }
}
