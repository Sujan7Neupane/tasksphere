"use client";

import { useParams, useRouter } from "next/navigation";

import CreateProjectForm from "../../../../../../components/project/CreateProjectForm";

const CreateProjectPage = () => {
  const params = useParams();
  const router = useRouter();

  const workspaceId = params.workspaceId as string;
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create Project</h1>

        <p className="mt-1 text-sm text-base-content/70">
          Create a new project in this workspace.
        </p>
      </div>

      <CreateProjectForm workspaceId={workspaceId} />
    </div>
  );
};

export default CreateProjectPage;
