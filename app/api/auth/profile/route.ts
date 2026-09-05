import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import cloudinaryUpload from "../../../../lib/cloudinaryUpload";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    // get formdata
    const formData = await req.formData();
    const name = formData.get("name");
    const image = formData.get("image");

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 },
      );
    }

    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { message: "Name must be between 2 and 50 characters." },
        { status: 400 },
      );
    }

    // if no image only name updates
    const updateData: {
      name: string;
      image?: string;
    } = {
      name,
    };

    if (image instanceof File && image.size > 0) {
      const uploadResponse = await cloudinaryUpload(image);

      //   console.log(uploadResponse);

      if (!uploadResponse) {
        return NextResponse.json(
          { message: "Image upload failed." },
          { status: 400 },
        );
      }

      updateData.image = uploadResponse.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        platformRole: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully.",
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating the profile." },
      { status: 500 },
    );
  }
}
