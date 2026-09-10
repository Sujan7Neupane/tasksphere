"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useDeleteTask, useTask } from "../../../../../hooks/useTasks";

const TaskDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const taskId = params.taskId as string;

  const { data, isLoading, isError } = useTask(taskId);
  const deleteTask = useDeleteTask();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-sm text-base-content/70">Loading task...</p>
      </div>
    );
  }

  if (isError || !data?.task) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-sm text-error">Failed to load task.</p>
      </div>
    );
  }

  const task = data.task;

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    deleteTask.mutate(task.id, {
      onSuccess: () => {
        toast.success("Task deleted successfully");

        router.push(`/user/projects/${task.projectId}`);
      },

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Failed to delete task");
        } else {
          toast.error("Failed to delete task");
        }
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link
        href={`/user/projects/${task.projectId}`}
        className="btn btn-ghost btn-sm mb-4 rounded-md"
      >
        ← Back to Project
      </Link>

      <div className="rounded-md border border-base-300 bg-base-100">
        <div className="border-b border-base-300 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{task.title}</h1>

              {task.description && (
                <p className="mt-2 text-base-content/70">{task.description}</p>
              )}
            </div>

            <span className="badge badge-outline">{task.status}</span>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-base-content/60">Priority</p>
            <p className="mt-1 font-medium">{task.priority}</p>
          </div>

          <div>
            <p className="text-sm text-base-content/60">Assigned To</p>
            <p className="mt-1 font-medium">
              {task.assignedTo?.name || "Unassigned"}
            </p>
          </div>

          <div>
            <p className="text-sm text-base-content/60">Created By</p>
            <p className="mt-1 font-medium">{task.createdBy.name}</p>
          </div>

          <div>
            <p className="text-sm text-base-content/60">Due Date</p>
            <p className="mt-1 font-medium">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-base-300 p-6">
          <Link
            href={`/user/tasks/${task.id}/edit`}
            className="btn btn-outline btn-sm rounded-md"
          >
            Update
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="btn btn-error btn-sm rounded-md"
          >
            {deleteTask.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
