import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting database seed...");

  // Check seed credentials
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  const ownerEmail = process.env.SEED_OWNER_EMAIL;
  const ownerPassword = process.env.SEED_OWNER_PASSWORD;

  const workspaceAdminEmail = process.env.SEED_WORKSPACE_ADMIN_EMAIL;
  const workspaceAdminPassword = process.env.SEED_WORKSPACE_ADMIN_PASSWORD;

  const memberEmail = process.env.SEED_MEMBER_EMAIL;
  const memberPassword = process.env.SEED_MEMBER_PASSWORD;

  if (
    !adminEmail ||
    !adminPassword ||
    !ownerEmail ||
    !ownerPassword ||
    !workspaceAdminEmail ||
    !workspaceAdminPassword ||
    !memberEmail ||
    !memberPassword
  ) {
    throw new Error("Missing seed credentials. Please check your .env file.");
  }

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  console.log("Existing data cleared.");

  // Hash passwords
  const adminHashedPassword = await bcrypt.hash(adminPassword, 10);
  const ownerHashedPassword = await bcrypt.hash(ownerPassword, 10);
  const workspaceAdminHashedPassword = await bcrypt.hash(
    workspaceAdminPassword,
    10,
  );
  const memberHashedPassword = await bcrypt.hash(memberPassword, 10);

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: adminEmail,
      password: adminHashedPassword,
      platformRole: "ADMIN",
      isActive: true,
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "Sujan Don",
      email: ownerEmail,
      password: ownerHashedPassword,
      platformRole: "USER",
      isActive: true,
    },
  });

  const workspaceAdmin = await prisma.user.create({
    data: {
      name: "John Doe",
      email: workspaceAdminEmail,
      password: workspaceAdminHashedPassword,
      platformRole: "USER",
      isActive: true,
    },
  });

  const member = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: memberEmail,
      password: memberHashedPassword,
      platformRole: "USER",
      isActive: true,
    },
  });

  console.log("Users created.");

  // Create workspaces
  const developmentWorkspace = await prisma.workspace.create({
    data: {
      name: "Development Team",
      description: "Workspace for the TaskSphere development team.",
    },
  });

  const collegeWorkspace = await prisma.workspace.create({
    data: {
      name: "College Project",
      description: "Workspace for managing college projects and assignments.",
    },
  });

  console.log("Workspaces created.");

  // Create workspace members
  await prisma.workspaceMember.createMany({
    data: [
      {
        userId: owner.id,
        workspaceId: developmentWorkspace.id,
        role: "OWNER",
      },
      {
        userId: workspaceAdmin.id,
        workspaceId: developmentWorkspace.id,
        role: "ADMIN",
      },
      {
        userId: member.id,
        workspaceId: developmentWorkspace.id,
        role: "MEMBER",
      },
      {
        userId: owner.id,
        workspaceId: collegeWorkspace.id,
        role: "OWNER",
      },
      {
        userId: member.id,
        workspaceId: collegeWorkspace.id,
        role: "MEMBER",
      },
    ],
  });

  console.log("Workspace members created.");

  // Create projects
  const taskSphereProject = await prisma.project.create({
    data: {
      name: "TaskSphere",
      description: "Main TaskSphere application development.",
      workspaceId: developmentWorkspace.id,
    },
  });

  const backendProject = await prisma.project.create({
    data: {
      name: "Backend API",
      description: "Development of TaskSphere backend APIs.",
      workspaceId: developmentWorkspace.id,
    },
  });

  const collegeProject = await prisma.project.create({
    data: {
      name: "College Assignment",
      description: "Manage college assignment work.",
      workspaceId: collegeWorkspace.id,
    },
  });

  console.log("Projects created.");

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      title: "Create landing page",
      description: "Build the main TaskSphere landing page.",
      status: "DONE",
      priority: "HIGH",
      projectId: taskSphereProject.id,
      assignedToId: owner.id,
      createdById: owner.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Implement workspace chat",
      description: "Add real-time workspace chat using Socket.IO.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      projectId: taskSphereProject.id,
      assignedToId: workspaceAdmin.id,
      createdById: owner.id,
      dueDate: new Date("2026-10-01"),
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "Add notifications",
      description: "Implement notification creation and display.",
      status: "TODO",
      priority: "MEDIUM",
      projectId: taskSphereProject.id,
      assignedToId: member.id,
      createdById: owner.id,
      dueDate: new Date("2026-10-05"),
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: "Create authentication API",
      description: "Implement login and registration API endpoints.",
      status: "DONE",
      priority: "HIGH",
      projectId: backendProject.id,
      assignedToId: workspaceAdmin.id,
      createdById: owner.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: "Test API endpoints",
      description: "Test all backend endpoints and handle errors.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      projectId: backendProject.id,
      assignedToId: workspaceAdmin.id,
      createdById: workspaceAdmin.id,
      dueDate: new Date("2026-09-30"),
    },
  });

  const task6 = await prisma.task.create({
    data: {
      title: "Complete project documentation",
      description: "Write documentation for the college project.",
      status: "TODO",
      priority: "LOW",
      projectId: collegeProject.id,
      assignedToId: member.id,
      createdById: owner.id,
      dueDate: new Date("2026-10-10"),
    },
  });

  console.log("Tasks created.");

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content: "The landing page looks good. Nice work.",
        taskId: task1.id,
        authorId: owner.id,
      },
      {
        content: "I have started working on the Socket.IO connection.",
        taskId: task2.id,
        authorId: workspaceAdmin.id,
      },
      {
        content: "Make sure the notification API handles unread notifications.",
        taskId: task3.id,
        authorId: owner.id,
      },
      {
        content: "Authentication endpoints are working correctly.",
        taskId: task4.id,
        authorId: workspaceAdmin.id,
      },
      {
        content: "I found a few validation issues while testing.",
        taskId: task5.id,
        authorId: workspaceAdmin.id,
      },
      {
        content: "I will start working on the documentation today.",
        taskId: task6.id,
        authorId: member.id,
      },
    ],
  });

  console.log("Comments created.");

  // Create invitations
  await prisma.invitation.create({
    data: {
      email: "newmember@example.com",
      token: "seed-pending-invitation-token",
      workspaceId: developmentWorkspace.id,
      invitedById: owner.id,
      expiresAt: new Date("2026-12-31"),
      status: "PENDING",
    },
  });

  await prisma.invitation.create({
    data: {
      email: memberEmail,
      token: "seed-accepted-invitation-token",
      workspaceId: collegeWorkspace.id,
      invitedById: owner.id,
      expiresAt: new Date("2026-12-31"),
      status: "ACCEPTED",
    },
  });

  console.log("Invitations created.");

  // Create messages
  await prisma.message.createMany({
    data: [
      {
        content: "Welcome everyone to the development workspace!",
        workspaceId: developmentWorkspace.id,
        senderId: owner.id,
      },
      {
        content: "I have started working on the Socket.IO chat.",
        workspaceId: developmentWorkspace.id,
        senderId: workspaceAdmin.id,
      },
      {
        content: "Great. Let me know if you need help with testing.",
        workspaceId: developmentWorkspace.id,
        senderId: member.id,
      },
      {
        content: "Let's start working on the college assignment.",
        workspaceId: collegeWorkspace.id,
        senderId: owner.id,
      },
    ],
  });

  console.log("Messages created.");

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        type: "TASK_ASSIGNED",
        message: "You were assigned the task: Implement workspace chat.",
        relatedId: task2.id,
        userId: workspaceAdmin.id,
      },
      {
        type: "TASK_ASSIGNED",
        message: "You were assigned the task: Add notifications.",
        relatedId: task3.id,
        userId: member.id,
      },
      {
        type: "TASK_COMMENT",
        message: "John commented on the task: Test API endpoints.",
        relatedId: task5.id,
        userId: owner.id,
      },
      {
        type: "WORKSPACE_INVITATION",
        message:
          "You have been invited to join the Development Team workspace.",
        relatedId: developmentWorkspace.id,
        userId: member.id,
      },
      {
        type: "ROLE_CHANGED",
        message:
          "Your role in the Development Team workspace was changed to ADMIN.",
        relatedId: developmentWorkspace.id,
        userId: workspaceAdmin.id,
      },
    ],
  });

  console.log("Notifications created.");

  console.log("");
  console.log("Database seed completed successfully!");
  console.log("");
  console.log("Seed users:");
  console.log(`Admin: ${admin.email}`);
  console.log(`Owner: ${owner.email}`);
  console.log(`Workspace Admin: ${workspaceAdmin.email}`);
  console.log(`Member: ${member.email}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
