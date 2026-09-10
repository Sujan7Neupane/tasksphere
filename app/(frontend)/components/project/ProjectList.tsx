"use client";

import Link from "next/link";
import { useProjects } from "../../../hooks/useProjects";

type ProjectListProps = {
  workspaceId: string;
};

const ProjectList = ({ workspaceId }: ProjectListProps) => {
  const { data, isLoading, isError } = useProjects(workspaceId);
  //   console.log(data);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-md">
            Loading Projects...
          </span>
        </div>
      ) : isError ? (
        <div className="rounded-md border border-error/30 bg-error/10 p-4">
          <p className="text-sm text-error">Failed to load projects.</p>
        </div>
      ) : data?.projects.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <h2 className="text-lg font-medium">No projects yet</h2>

          <p className="mt-1 text-sm text-base-content/70">
            Create a project to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.projects.map(
            (project: {
              id: string;
              name: string;
              description?: string | null;
            }) => (
              <Link
                key={project.id}
                href={`/user/projects/${project.id}`}
                className="rounded-md border p-5 transition hover:border-primary"
              >
                <h2 className="text-lg font-semibold">{project.name}</h2>

                <p className="mt-2 text-sm text-base-content/70">
                  {project.description || "No description provided."}
                </p>
              </Link>
            ),
          )}
        </div>
      )}
    </>
  );
};

export default ProjectList;
