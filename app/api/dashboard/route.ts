import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const userId = session.user.id;
    const workspaceMembers = await prisma.workspaceMember.findMany({
      where: {
        userId,
      },
      select: {
        workspaceId: true,
      },
    });

    const workspaceIds = workspaceMembers.map((member) => member.workspaceId);

    const projects = await prisma.project.findMany({
      where: {
        workspaceId: {
          in: workspaceIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const projectIds = projects.map((project) => project.id);

    const tasks = await prisma.task.findMany({
      where: {
        projectId: {
          in: projectIds,
        },
        assignedToId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const unreadNotificationsCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    const recentNotifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        type: true,
        message: true,
        isRead: true,
        relatedId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      workspacesCount: workspaceIds.length,
      projectsCount: projects.length,
      tasksCount: await prisma.task.count({
        where: {
          projectId: {
            in: projectIds,
          },
          assignedToId: userId,
        },
      }),
      unreadNotificationsCount,
      recentTasks: tasks,
      recentNotifications,
    });
  } catch (error) {
    console.error("Get dashboard error:", error);

    return NextResponse.json(
      { message: "Failed to get dashboard data." },
      { status: 500 },
    );
  }
}
