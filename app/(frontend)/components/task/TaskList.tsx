"use client";

import Link from "next/link";
import { useTasks } from "../../../hooks/useTasks";

type TaskListProps = {
  projectId: string;
};

const TaskList = ({ projectId }: TaskListProps) => {
  //   console.log(projectId);

  const { data, isLoading, isError } = useTasks(projectId);
  // console.log(data);

  if (isLoading) {
    return (
      <p className="pt-2 text-sm text-base-content/70">Loading tasks...</p>
    );
  }

  if (isError) {
    return <p className="pt-2 text-sm text-error">Failed to load tasks.</p>;
  }

  const tasks = data?.tasks ?? [];

  if (tasks.length === 0) {
    return (
      <div className="pt-2">
        <p className="text-sm text-base-content/70">No tasks yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {tasks.map((task: any) => (
        <Link
          key={task.id}
          href={`/user/tasks/${task.id}`}
          className="block rounded-md border border-base-300 p-4 transition hover:bg-base-200"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium">{task.title}</h3>

            <span className="badge badge-outline">{task.status}</span>
          </div>

          {task.description && (
            <p className="mt-2 text-sm text-base-content/70">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex gap-3 text-xs text-base-content/60">
            <span>Priority: {task.priority}</span>

            {task.dueDate && (
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
          </div>

          {task.assignedTo && (
            <span className="mt-3">Assigned to: {task.assignedTo.name}</span>
          )}
        </Link>
      ))}
    </div>
  );
};

export default TaskList;
