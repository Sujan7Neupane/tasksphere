"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useAdminWorkspace,
  useDeleteAdminWorkspace,
} from "../../../../../hooks/userAdminUsers";

const AdminWorkspaceDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  const { data, isLoading, isError } = useAdminWorkspace(workspaceId);

  const deleteWorkspace = useDeleteAdminWorkspace();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace? This action cannot be undone.",
    );

    if (!confirmed) return;

    deleteWorkspace.mutate(workspaceId, {
      onSuccess: (data) => {
        toast.success(data.message);
        router.push("/admin/workspaces");
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

  if (isError || !data?.workspace) {
    return (
      <div className="space-y-4">
        <Link href="/admin/workspaces" className="btn btn-sm btn-ghost">
          Back to Workspaces
        </Link>

        <div className="alert alert-error">Workspace not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 m-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/workspaces"
            className="mb-3 inline-block text-sm text-base-content/60 hover:text-base-content"
          >
            ← Back to Workspaces
          </Link>

          <h1 className="text-2xl font-bold">{data?.workspace.name}</h1>

          {data?.workspace.description && (
            <p className="mt-1 text-base-content/70">
              {data?.workspace.description}
            </p>
          )}
        </div>

        <button
          type="button"
          className="btn btn-error"
          disabled={deleteWorkspace.isPending}
          onClick={handleDelete}
        >
          {deleteWorkspace.isPending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Delete Workspace"
          )}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-base-300 p-5">
          <p className="text-sm text-base-content/60">Members</p>

          <p className="mt-1 text-2xl font-bold">
            {data?.workspace.memberCount}
          </p>
        </div>

        <div className="rounded-lg border border-base-300 p-5">
          <p className="text-sm text-base-content/60">Projects</p>

          <p className="mt-1 text-2xl font-bold">
            {data?.workspace.projectCount}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-base-300 p-5">
        <h2 className="mb-4 text-lg font-semibold">Owner</h2>

        {data?.workspace.owner ? (
          <div>
            <p className="font-medium">{data?.workspace.owner.name}</p>

            <p className="text-sm text-base-content/60">
              {data?.workspace.owner.email}
            </p>
          </div>
        ) : (
          <p className="text-base-content/60">No owner</p>
        )}
      </div>

      <div className="rounded-lg border border-base-300">
        <div className="border-b border-base-300 p-5">
          <h2 className="text-lg font-semibold">Members</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {data?.workspace.members.map((member) => (
                <tr key={member.id}>
                  <td className="font-medium">{member.user.name}</td>

                  <td>{member.user.email}</td>

                  <td>
                    <span className="badge badge-ghost">{member.role}</span>
                  </td>

                  <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-base-content/60">
        <p>
          Created: {new Date(data?.workspace.createdAt).toLocaleDateString()}
        </p>

        <p>
          Last updated:{" "}
          {new Date(data?.workspace.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default AdminWorkspaceDetailsPage;
