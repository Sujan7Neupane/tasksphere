"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import { useUpdateTask } from "../../../hooks/useTasks";
import {
  UpdateTaskData,
  updateTaskSchema,
} from "../../../schemas/task.schemas";
import { useWorkspaceMembers } from "../../../hooks/useMembers";

type UpdateTaskFormProps = {
  taskId: string;
  workspaceId: string;
  initialTitle: string;
  initialDescription: string | null;
  initialPriority: "LOW" | "MEDIUM" | "HIGH";
  initialDueDate: string | null;
  initialAssignedToId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const UpdateTaskForm = ({
  taskId,
  workspaceId,
  initialTitle,
  initialDescription,
  initialPriority,
  initialDueDate,
  initialAssignedToId,
  onSuccess,
  onCancel,
}: UpdateTaskFormProps) => {
  const updateTask = useUpdateTask();

  const { data: membersData, isLoading: isMembersLoading } =
    useWorkspaceMembers(workspaceId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTaskData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: initialTitle,
      description: initialDescription || "",
      priority: initialPriority,
      dueDate: initialDueDate ? initialDueDate.slice(0, 10) : "",
      assignedToId: initialAssignedToId,
    },
  });

  const onSubmit = (data: UpdateTaskData) => {
    updateTask.mutate(
      {
        taskId,
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
          assignedToId: data.assignedToId || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Task updated successfully");
          onSuccess();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update task",
            );
          } else {
            toast.error("Failed to update task");
          }
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-md border border-base-300 bg-base-100 p-6">
        <h1 className="text-2xl font-semibold"> Update Task </h1>
        <p className="mt-1 text-sm text-base-content/70">
          Update the task information.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormInput
            label="Title"
            placeholder="Enter task title"
            error={errors.title?.message}
            {...register("title")}
          />
          <div>
            <label className="label">
              <span className="label-text"> Description </span>
            </label>
            <textarea
              {...register("description")}
              placeholder="Enter task description"
              className="textarea textarea-bordered w-full rounded-md"
              rows={5}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="label">
              <span className="label-text"> Priority </span>
            </label>
            <select
              {...register("priority")}
              className="select select-bordered w-full rounded-md"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-error">
                {errors.priority.message}
              </p>
            )}
          </div>
          <div>
            <label className="label">
              <span className="label-text"> Assigned To </span>
            </label>
            <select
              {...register("assignedToId")}
              className="select select-bordered w-full rounded-md"
              disabled={isMembersLoading}
            >
              <option value="">
                {isMembersLoading ? "Loading members..." : "Unassigned"}{" "}
              </option>
              {membersData?.members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            {errors.assignedToId && (
              <p className="mt-1 text-sm text-error">
                {errors.assignedToId.message}
              </p>
            )}
          </div>
          <div>
            <label className="label">
              <span className="label-text"> Due Date </span>
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="input input-bordered w-full rounded-md"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-error">
                {errors.dueDate.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost rounded-md"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={updateTask.isPending || isMembersLoading}
            >
              {updateTask.isPending ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdateTaskForm;
