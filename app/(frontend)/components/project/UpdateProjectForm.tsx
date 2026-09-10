"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";

import FormInput from "../ui/FormInput";
import Button from "../ui/Button";

import {
  UpdateProjectData,
  updateProjectSchema,
} from "../../../schemas/project.schema";
import { useUpdateProject } from "../../../hooks/useProjects";

type UpdateProjectFormProps = {
  projectId: string;
  initialName: string;
  initialDescription?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const UpdateProjectForm = ({
  projectId,
  initialName,
  initialDescription,
  onSuccess,
  onCancel,
}: UpdateProjectFormProps) => {
  const updateProject = useUpdateProject(projectId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProjectData>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: initialName,
      description: initialDescription || "",
    },
  });

  const onSubmit = (data: UpdateProjectData) => {
    updateProject.mutate(
      {
        projectId,
        data,
      },
      {
        onSuccess: () => {
          toast.success("Project updated successfully");
          onSuccess();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update project",
            );
          } else {
            toast.error("Failed to update project");
          }
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-2xl rounded-md border border-base-300 bg-base-100 p-6 shadow-sm mt-10">
      <div className="mb-6 border-b border-base-300 pb-4">
        <h2 className="text-xl font-semibold">Update Project</h2>

        <p className="mt-1 text-sm text-base-content/70">
          Update your project name and description.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Project Name"
          type="text"
          {...register("name")}
          error={errors.name?.message}
        />

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>

          <textarea
            {...register("description")}
            rows={5}
            placeholder="Enter project description"
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

        <div className="flex justify-end gap-2 border-t border-base-300 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost rounded-md"
            disabled={updateProject.isPending}
          >
            Cancel
          </button>

          <Button type="submit" disabled={updateProject.isPending}>
            {updateProject.isPending ? "Updating..." : "Update Project"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProjectForm;
