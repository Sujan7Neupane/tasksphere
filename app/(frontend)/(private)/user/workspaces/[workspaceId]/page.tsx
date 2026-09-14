"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useDeleteWorkspace,
  useWorkspace,
} from "../../../../../hooks/useWorkspaces";
import Button from "../../../../components/ui/Button";
import WorkspaceChat from "../../../../components/chat/WorkspaceChat";
import { useSession } from "next-auth/react";

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const { data: session } = useSession();

  const { data, isLoading, isError } = useWorkspace(workspaceId);
  const { mutate: deleteWorkspace, isPending } = useDeleteWorkspace();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${data?.workspace.name}"?`,
    );
    if (!confirmed) {
      return;
    }

    deleteWorkspace(workspaceId, {
      onSuccess: () => {
        toast.success("Workspace deleted successfully");
        router.push("/user/workspaces");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || "Failed to delete workspace";
        toast.error(message);
      },
    });
  }

  return (
    <>
      {isLoading ? (
        <main className="mx-auto max-w-7xl px-4 py-8">
          <p>Loading workspace...</p>
        </main>
      ) : isError ? (
        <main className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-error">Failed to load workspace.</p>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Link
            href="/user/workspaces"
            className="btn btn-ghost btn-sm mb-4 sm:mb-6"
          >
            ← Back to Workspaces
          </Link>

          <div className="rounded-lg border border-base-300 bg-base-100">
            <div className="border-b border-base-300 p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <h1 className="text-xl font-bold wrap-break-words sm:text-2xl">
                    {data?.workspace.name}
                  </h1>
                  <p className="mt-2 text-sm text-base-content/60">
                    {data?.workspace.description || "No description"}
                  </p>
                </div>
                <span className="badge badge-primary self-start">
                  {data?.role}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:p-6">
              {(data?.role === "OWNER" || data?.role === "ADMIN") && (
                <Link
                  href={`/user/workspaces/${workspaceId}/settings`}
                  className="btn btn-outline w-full sm:w-auto"
                >
                  Edit Workspace
                </Link>
              )}

              {data?.role === "OWNER" && (
                <Button
                  type="button"
                  className="btn btn-error w-full sm:w-auto"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete Workspace"}
                </Button>
              )}
            </div>
          </div>
          {session?.user?.id && (
            <div className="mt-6">
              <WorkspaceChat
                workspaceId={workspaceId}
                currentUserId={session.user.id}
              />
            </div>
          )}
        </main>
      )}
    </>
  );
}
