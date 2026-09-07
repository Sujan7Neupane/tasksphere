"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useCreateWorkspace } from "../../../hooks/useWorkspaces";
import {
  CreateWorkspaceFormData,
  createWorkspaceSchema,
} from "../../../schemas/workspaces.schema";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";

interface CreateWorkspaceModalProps {
  onClose: () => void;
}

export default function CreateWorkspaceModal({
  onClose,
}: CreateWorkspaceModalProps) {
  const { mutate, isPending } = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: CreateWorkspaceFormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Workspace created successfully");

        reset();
        onClose();
      },

      onError: (error: any) => {
        console.log(error);

        const message =
          error?.response?.data?.message || "Failed to create workspace";

        toast.error(message);
      },
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-xl font-bold">Create Workspace</h2>

        <p className="mt-1 text-sm text-base-content/60">
          Create a workspace to start collaborating.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <FormInput
              placeholder="Enter workspace name"
              label="Workspace Name"
              {...register("name")}
              type="text"
              className="input input-bordered w-full"
              disabled={isPending}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text ml-2 mb-1">Description</span>
            </label>

            <textarea
              {...register("description")}
              placeholder="What is this workspace for?"
              className="textarea textarea-bordered w-full rounded-md"
              rows={3}
              disabled={isPending}
            />

            {errors.description && (
              <p className="mt-1 text-sm text-error">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="modal-action">
            <Button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Creating...
                </>
              ) : (
                "Create Workspace"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
