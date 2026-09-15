"use client";

import { useDashboard } from "../../../hooks/useDashboard";

type UserDashboardProps = {
  userName: string;
  userEmail: string;
};

const UserDashboard = ({ userName, userEmail }: UserDashboardProps) => {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex min-h-75 items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <div className="alert alert-error">
          <span>Failed to load dashboard data.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome {userName || userEmail}</h1>

        <p className="mt-1 text-base-content/70">
          Here is an overview of your TaskSphere activity.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Workspaces</p>

            <p className="text-3xl font-bold">{data?.workspacesCount ?? 0}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Projects</p>

            <p className="text-3xl font-bold">{data?.projectsCount ?? 0}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">My Tasks</p>

            <p className="text-3xl font-bold">{data?.tasksCount ?? 0}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Unread Notifications</p>

            <p className="text-3xl font-bold">
              {data?.unreadNotificationsCount ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">My Recent Tasks</h2>

        <div className="overflow-x-auto rounded-box bg-base-100 shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>

            <tbody>
              {data?.recentTasks.map((task) => (
                <tr key={task.id}>
                  <td className="font-medium">{task.title}</td>

                  <td>{task.project.name}</td>

                  <td>
                    <span className="badge badge-outline">{task.status}</span>
                  </td>

                  <td>
                    <span className="badge badge-outline">{task.priority}</span>
                  </td>

                  <td>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date"}
                  </td>
                </tr>
              ))}

              {data?.recentTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    No tasks assigned to you.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Recent Notifications</h2>

        <div className="rounded-box bg-base-100 shadow">
          {data?.recentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b border-base-300 px-4 py-3 last:border-b-0 ${
                !notification.isRead ? "bg-base-200" : ""
              }`}
            >
              <p className="text-sm">{notification.message}</p>

              <p className="mt-1 text-xs text-base-content/60">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}

          {data?.recentNotifications.length === 0 && (
            <p className="p-4 text-sm text-base-content/70">
              No notifications.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
