"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  useUpdateWorkspace,
  useWorkspace,
} from "../../../../../../hooks/useWorkspaces";
import {
  CreateWorkspaceFormData,
  createWorkspaceSchema,
} from "../../../../../../schemas/workspaces.schema";
import FormInput from "../../../../../components/ui/FormInput";
import Button from "../../../../../components/ui/Button";

export default function WorkspaceSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const { data, isLoading, isError } = useWorkspace(workspaceId);
  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  function onSubmit(formData: CreateWorkspaceFormData) {
    updateWorkspace(
      {
        workspaceId,
        data: formData,
      },
      {
        onSuccess: () => {
          toast.success("Workspace updated successfully");
          router.push(`/user/workspaces/${workspaceId}`);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to update workspace";
          toast.error(message);
        },
      },
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {isLoading ? (
        <p>Loading...</p>
      ) : isError || !data ? (
        <p className="text-error">Failed to load workspace.</p>
      ) : data.role === "MEMBER" ? (
        <p className="text-error">
          You do not have permission to update this workspace.
        </p>
      ) : (
        <>
          <button
            type="button"
            className="btn btn-ghost btn-sm mb-6"
            onClick={() => router.push(`/user/workspaces/${workspaceId}`)}
          >
            ← Back
          </button>

          <div className="rounded-lg border border-base-300 bg-base-100 p-6">
            <h1 className="text-xl font-bold">Workspace Settings</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <div>
                <FormInput
                  label="Workspace name"
                  {...register("name")}
                  defaultValue={data.workspace.name}
                  className="input input-bordered w-full"
                  disabled={isPending}
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-error">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text ml-1 mb-1">Description</span>
                </label>

                <textarea
                  {...register("description")}
                  defaultValue={data.workspace.description ?? ""}
                  rows={4}
                  className="textarea textarea-bordered w-full rounded-sm"
                  disabled={isPending}
                />

                {errors.description && (
                  <p className="mt-1 text-sm text-error">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </main>
  );
}
