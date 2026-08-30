import { NextResponse } from "next/server";
import prisma from "../../../prisma/client";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    // console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}
