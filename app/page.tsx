import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    if (session.user.platformRole === "ADMIN") {
      redirect("/admin/dashboard");
    }

    redirect("/user/dashboard");
  }

  return (
    <main className="flex-1">
      <section className="border-b border-base-300">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:py-28">
          <div className="badge badge-outline mb-6">
            Full-Stack Collaboration Platform
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            TaskSphere
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-base-content/70">
            A full-stack team collaboration platform for managing workspaces,
            projects, tasks, members, real-time communication, and
            notifications.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="btn btn-primary">
              Get Started
            </Link>

            <Link href="/login" className="btn btn-outline">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Built for team collaboration</h2>

          <p className="mx-auto mt-4 max-w-2xl text-base-content/60">
            TaskSphere combines project management, workspace collaboration, and
            real-time communication in one application.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-base-300 bg-base-100 p-6">
            <h3 className="text-lg font-semibold">Workspaces & Members</h3>
            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Create workspaces, invite members, and manage workspace roles and
              permissions.
            </p>
          </div>

          <div className="rounded-lg border border-base-300 bg-base-100 p-6">
            <h3 className="text-lg font-semibold">Projects & Tasks</h3>
            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Organize projects and manage tasks with status, priority, due
              dates, assignments, and comments.
            </p>
          </div>

          <div className="rounded-lg border border-base-300 bg-base-100 p-6">
            <h3 className="text-lg font-semibold">Real-time Chat</h3>
            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Communicate with workspace members through real-time messaging
              powered by Socket.IO.
            </p>
          </div>

          <div className="rounded-lg border border-base-300 bg-base-100 p-6">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Receive notifications for important workspace and task-related
              activity.
            </p>
          </div>

          <div className="rounded-lg border border-base-300 bg-base-100 p-6">
            <h3 className="text-lg font-semibold">Role-based Access</h3>
            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Separate platform administrators from workspace roles with
              protected routes and permissions.
            </p>
          </div>

          <div className="rounded-lg border border-base-300 bg-base-100 p-6">
            <h3 className="text-lg font-semibold">Admin Dashboard</h3>
            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Platform administrators can manage users and workspaces from a
              dedicated dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-base-300 bg-base-200/40">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-20">
          <h2 className="text-3xl font-bold">Technology</h2>

          <p className="mx-auto mt-4 max-w-2xl text-base-content/60">
            Built with modern full-stack technologies with a focus on
            authentication, authorization, data management, and real-time
            communication.
          </p>

          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
            <span className="badge badge-lg badge-outline">Next.js</span>
            <span className="badge badge-lg badge-outline">TypeScript</span>
            <span className="badge badge-lg badge-outline">Prisma</span>
            <span className="badge badge-lg badge-outline">PostgreSQL</span>
            <span className="badge badge-lg badge-outline">Auth.js</span>
            <span className="badge badge-lg badge-outline">Socket.IO</span>
            <span className="badge badge-lg badge-outline">TanStack Query</span>
            <span className="badge badge-lg badge-outline">Tailwind CSS</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
        <h2 className="text-3xl font-bold">Explore TaskSphere</h2>

        <p className="mx-auto mt-4 max-w-2xl text-base-content/60">
          Create an account and explore the collaboration features built into
          the platform.
        </p>

        <div className="mt-8">
          <Link href="/register" className="btn btn-primary">
            Create an Account
          </Link>
        </div>
      </section>

      <footer className="border-t border-base-300">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-base-content/50">
          TaskSphere — Full-stack collaboration platform
        </div>
      </footer>
    </main>
  );
}
