"use client";

import { useParams, useRouter } from "next/navigation";
import { useDeleteProject, useProject } from "../../../../../hooks/useProjects";
import UpdateProjectForm from "../../../../components/project/UpdateProjectForm";
import { useState } from "react";
import Button from "../../../../components/ui/Button";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import TaskList from "../../../../components/task/TaskList";

const ProjectDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const { data, isLoading, isError } = useProject(projectId);

  const [isEditing, setIsEditing] = useState(false);

  const deleteProjectMutation = useDeleteProject(projectId);

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    deleteProjectMutation.mutate(projectId, {
      onSuccess: () => {
        toast.success("Project deleted successfully");

        router.push(`/user/workspaces/${data?.project?.workspaceId}/projects`);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to delete project",
          );
        } else {
          toast.error("Failed to delete project");
        }
      },
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading project...</div>;
  }

  if (isError) {
    return <div className="p-6 text-error">Failed to load project.</div>;
  }

  if (!data?.project) {
    return <div className="p-6">Project not found.</div>;
  }

  return (
    <>
      <div className="ml-15 mt-5 text-2xl">
        <Link
          href={`/user/workspaces/${data?.project?.workspaceId}/projects`}
          className="btn btn-ghost btn-sm mb-4 rounded-md"
        >
          ← Back to project
        </Link>
      </div>
      {isEditing ? (
        <>
          <UpdateProjectForm
            projectId={data?.project.id}
            initialName={data?.project.name}
            initialDescription={data?.project.description}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />

          <Button
            type="button"
            onClick={() => setIsEditing(false)}
            className="btn btn-ghost mt-2 rounded-md"
          >
            Cancel
          </Button>
        </>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-md border p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">{data?.project.name}</h1>

                <p className="mt-2 text-sm text-base-content/70">
                  {data?.project.description || "No description provided."}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary btn-sm rounded-md"
                >
                  Update
                </Button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteProjectMutation.isPending}
                  className="btn btn-error btn-sm rounded-md"
                >
                  {deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>

            <div className="mt-5 border-t pt-4 text-sm">
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(data?.project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-md border border-base-300 bg-base-100">
            <div className="flex items-center justify-between border-b border-base-300 p-5">
              <div>
                <h2 className="text-lg font-semibold">Tasks</h2>

                <p className="mt-1 text-sm text-base-content/70">
                  Manage tasks for this project.
                </p>
              </div>

              <Link
                href={`/user/projects/${data?.project.id}/tasks/create`}
                className="btn btn-primary btn-sm rounded-md"
              >
                Create Task
              </Link>
            </div>

            <div className="p-5">
              <TaskList projectId={data?.project.id} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetailsPage;
