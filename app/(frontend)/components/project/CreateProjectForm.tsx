"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import { useCreateProject } from "../../../hooks/useProjects";
import {
  CreateProjectData,
  createProjectSchema,
} from "../../../schemas/project.schema";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

type CreateProjectFormProps = {
  workspaceId: string;
};

const CreateProjectForm = ({ workspaceId }: CreateProjectFormProps) => {
  const router = useRouter();
  const createProjectMutation = useCreateProject(workspaceId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = (data: CreateProjectData) => {
    createProjectMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Project created successfully");
        router.push(`/user/workspaces/${workspaceId}/projects`);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to create project",
          );
        } else {
          toast.error("Something went wrong");
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormInput
        label="Project name"
        type="text"
        placeholder="Enter project name"
        {...register("name")}
        error={errors.name?.message}
      />

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text mb-2">Description</span>
        </label>

        <textarea
          {...register("description")}
          placeholder="Enter project description"
          className="textarea textarea-bordered w-full rounded-sm"
          rows={5}
        />

        {errors.description && (
          <p className="mt-1 text-sm text-error">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={createProjectMutation.isPending}>
        {createProjectMutation.isPending ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
};

export default CreateProjectForm;
