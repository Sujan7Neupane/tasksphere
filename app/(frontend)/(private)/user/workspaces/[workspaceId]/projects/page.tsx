"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ProjectList from "../../../../../components/project/ProjectList";

const ProjectsPage = () => {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>

          <p className="mt-1 text-sm text-base-content/70">
            Manage projects in this workspace.
          </p>
        </div>

        <Link
          href={`/user/workspaces/${workspaceId}/projects/create`}
          className="btn btn-primary rounded-md"
        >
          Create Project
        </Link>
      </div>

      <ProjectList workspaceId={workspaceId} />
    </div>
  );
};

export default ProjectsPage;
