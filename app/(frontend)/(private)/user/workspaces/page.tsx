"use client";

import Link from "next/link";
import { useWorkspaces } from "../../../../hooks/useWorkspaces";
import Button from "../../../components/ui/Button";
import CreateWorkspaceModal from "../../../components/workspaces/CreateWorkspaceModal";
import { useState } from "react";

export default function WorkspacesPage() {
  const { data: workspaces, isLoading, isError } = useWorkspaces();
  //   console.log(workspaces);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      {isLoading ? (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p>Loading workspaces...</p>
        </main>
      ) : isError ? (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p>Failed to load workspaces.</p>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Workspaces</h1>

              <p className="mt-1 text-sm text-base-content/60">
                Workspaces you belong to.
              </p>
            </div>

            <Button onClick={() => setIsCreateModalOpen(true)}>
              + New Workspace
            </Button>
          </div>

          {workspaces?.length === 0 ? (
            <div className="rounded-lg border border-base-300 p-8 text-center">
              <h2 className="text-lg font-semibold">No workspaces yet</h2>

              <p className="mt-2 text-sm text-base-content/60">
                Create a workspace to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>Workspace</th>
                    <th>Description</th>
                    <th>Your Role</th>
                    <th>Joined</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {workspaces?.map((workspace) => (
                    <tr key={workspace.id}>
                      <td>
                        <div className="font-semibold">{workspace.name}</div>
                      </td>

                      <td className="text-base-content/70">
                        {workspace.description || "—"}
                      </td>

                      <td>
                        <span className="badge badge-primary">
                          {workspace.role}
                        </span>
                      </td>

                      <td className="text-base-content/70">
                        {new Date(workspace.joinedAt).toLocaleDateString()}
                      </td>

                      <td className="text-right">
                        <Link
                          href={`/user/workspaces/${workspace.id}`}
                          className="btn btn-sm btn-outline"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      )}

      {isCreateModalOpen && (
        <CreateWorkspaceModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </>
  );
}
