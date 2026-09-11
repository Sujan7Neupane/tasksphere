"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTask } from "../../../../../../hooks/useTasks";
import UpdateTaskForm from "../../../../../components/task/UpdateTaskForm";

const UpdateTaskPage = () => {
  const params = useParams();
  const router = useRouter();

  const taskId = params.taskId as string;

  const { data, isLoading, isError } = useTask(taskId);

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

        <Link
          href="/user/dashboard"
          className="btn btn-ghost btn-sm mt-4 rounded-md"
        >
          Back
        </Link>
      </div>
    );
  }

  const task = data.task;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/user/tasks/${task.id}`}
          className="btn btn-ghost btn-sm mb-4 rounded-md"
        >
          ← Back to Task
        </Link>
      </div>

      <UpdateTaskForm
        taskId={task.id}
        workspaceId={task.project.workspaceId}
        initialTitle={task.title}
        initialDescription={task.description}
        initialPriority={task.priority}
        initialDueDate={task.dueDate}
        initialAssignedToId={task.assignedToId}
        onSuccess={() => {
          router.push(`/user/tasks/${task.id}`);
        }}
        onCancel={() => {
          router.push(`/user/tasks/${task.id}`);
        }}
      />
    </div>
  );
};

export default UpdateTaskPage;
