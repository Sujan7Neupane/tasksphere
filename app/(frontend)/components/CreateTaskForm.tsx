"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useCreateTask } from "../../hooks/useTasks";
import {
  CreateTaskFormData,
  createTaskSchema,
} from "../../schemas/tasks.schema";
import FormInput from "./ui/FormInput";
import Button from "./ui/Button";

type CreateTaskFormProps = {
  projectId: string;
  onSuccess: () => void;
};

const CreateTaskForm = ({ projectId, onSuccess }: CreateTaskFormProps) => {
  const createTask = useCreateTask(projectId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: "MEDIUM",
    },
  });

  const onSubmit = (data: CreateTaskFormData) => {
    createTask.mutate(
      {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate
          ? new Date(data.dueDate).toISOString()
          : undefined,
        assignedToId: data.assignedToId || undefined,
      },
      {
        onSuccess,
        onError: (error) => {
          // console.log(error.message.data);

          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to create task",
            );
          } else {
            toast.error("Failed to create task");
          }
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-2xl rounded-md border border-base-300 bg-base-100 p-6 shadow-sm">
      <div className="mb-6 border-b border-base-300 pb-4">
        <h2 className="text-xl font-semibold">Create Task</h2>

        <p className="mt-1 text-sm text-base-content/70">
          Create a new task for this project.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Task Title"
          type="text"
          placeholder="Enter task title"
          {...register("title")}
          error={errors.title?.message}
        />

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>

          <textarea
            {...register("description")}
            rows={5}
            placeholder="Enter task description"
            className={`textarea textarea-bordered w-full rounded-md ${
              errors.description ? "textarea-error" : ""
            }`}
          />

          {errors.description && (
            <p className="mt-1 text-sm text-error">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Priority</label>

          <select
            {...register("priority")}
            className="select select-bordered w-full rounded-md"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          {errors.priority && (
            <p className="mt-1 text-sm text-error">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Due Date</label>

          <input
            type="date"
            {...register("dueDate")}
            className="input input-bordered w-full rounded-md"
          />

          {errors.dueDate && (
            <p className="mt-1 text-sm text-error">{errors.dueDate.message}</p>
          )}
        </div>

        <div className="flex justify-end border-t border-base-300 pt-5">
          <Button type="submit" disabled={createTask.isPending}>
            {createTask.isPending ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;
