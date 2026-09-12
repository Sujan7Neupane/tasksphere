"use client";

import Link from "next/link";
import {
  useAdminUsers,
  useAdminWorkspaces,
} from "../../../../hooks/userAdminUsers";

const Dashboard = () => {
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useAdminUsers();

  const {
    data: workspacesData,
    isLoading: workspacesLoading,
    isError: workspacesError,
  } = useAdminWorkspaces();

  if (usersLoading || workspacesLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex min-h-75 items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (usersError || workspacesError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <div className="alert alert-error">
          <span>Failed to load dashboard data.</span>
        </div>
      </div>
    );
  }

  const users = usersData?.users ?? [];
  const workspaces = workspacesData?.workspaces ?? [];

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const disabledUsers = users.filter((user) => !user.isActive).length;

  const totalWorkspaces = workspaces.length;

  const totalProjects = workspaces.reduce(
    (total, workspace) => total + workspace.projectCount,
    0,
  );

  const recentUsers = [...users].slice(0, 5);
  const recentWorkspaces = [...workspaces].slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-base-content/70">
          Manage users and workspaces across TaskSphere.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Total Users</p>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Active Users</p>
            <p className="text-3xl font-bold">{activeUsers}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Disabled Users</p>
            <p className="text-3xl font-bold">{disabledUsers}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Workspaces</p>
            <p className="text-3xl font-bold">{totalWorkspaces}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Projects</p>
            <p className="text-3xl font-bold">{totalProjects}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/admin/users" className="btn btn-primary">
          Manage Users
        </Link>

        <Link href="/admin/workspaces" className="btn btn-outline">
          Manage Workspaces
        </Link>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Users</h2>

          <Link href="/admin/users" className="link link-primary text-sm">
            View all
          </Link>
        </div>

        <div className="overflow-x-auto rounded-box bg-base-100 shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    <span className="badge badge-outline">
                      {user.platformRole}
                    </span>
                  </td>

                  <td>
                    {user.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-error">Disabled</span>
                    )}
                  </td>
                </tr>
              ))}

              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Workspaces</h2>

          <Link href="/admin/workspaces" className="link link-primary text-sm">
            View all
          </Link>
        </div>

        <div className="overflow-x-auto rounded-box bg-base-100 shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Workspace</th>
                <th>Owner</th>
                <th>Members</th>
                <th>Projects</th>
              </tr>
            </thead>

            <tbody>
              {recentWorkspaces.map((workspace) => (
                <tr key={workspace.id}>
                  <td>{workspace.name}</td>

                  <td>
                    {workspace.owner ? (
                      <div>
                        <p className="font-medium">{workspace.owner.name}</p>
                        <p className="text-sm text-base-content/60">
                          {workspace.owner.email}
                        </p>
                      </div>
                    ) : (
                      "No owner"
                    )}
                  </td>

                  <td>{workspace.memberCount}</td>

                  <td>{workspace.projectCount}</td>
                </tr>
              ))}

              {recentWorkspaces.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    No workspaces found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
