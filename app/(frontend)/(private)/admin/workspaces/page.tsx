"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import {
  useAdminWorkspaces,
  useDeleteAdminWorkspace,
} from "../../../../hooks/userAdminUsers";

const AdminWorkspacesPage = () => {
  const { data, isLoading, isError } = useAdminWorkspaces();
  const deleteWorkspace = useDeleteAdminWorkspace();

  const handleDelete = (workspaceId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace?",
    );

    if (!confirmed) return;

    deleteWorkspace.mutate(workspaceId, {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Something went wrong");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-error">Failed to load workspaces.</div>;
  }

  return (
    <div className="space-y-6 m-6">
      <div>
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <p className="text-base-content/70">Manage TaskSphere workspaces.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-base-300">
        <table className="table">
          <thead>
            <tr>
              <th>Workspace</th>
              <th>Owner</th>
              <th>Members</th>
              <th>Projects</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.workspaces.map((workspace) => (
              <tr key={workspace.id}>
                <td>
                  <div>
                    <p className="font-medium">{workspace.name}</p>

                    {workspace.description && (
                      <p className="max-w-xs truncate text-sm text-base-content/60">
                        {workspace.description}
                      </p>
                    )}
                  </div>
                </td>

                <td>
                  {workspace.owner ? (
                    <div>
                      <p className="font-medium">{workspace.owner.name}</p>
                      <p className="text-sm text-base-content/60">
                        {workspace.owner.email}
                      </p>
                    </div>
                  ) : (
                    <span className="text-base-content/50">No owner</span>
                  )}
                </td>

                <td>{workspace.memberCount}</td>

                <td>{workspace.projectCount}</td>

                <td>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/workspaces/${workspace.id}`}
                      className="btn btn-sm btn-outline"
                    >
                      View
                    </Link>

                    <button
                      type="button"
                      className="btn btn-sm btn-error"
                      disabled={deleteWorkspace.isPending}
                      onClick={() => handleDelete(workspace.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.workspaces.length === 0 && (
        <div className="py-10 text-center text-base-content/60">
          No workspaces found.
        </div>
      )}
    </div>
  );
};

export default AdminWorkspacesPage;
