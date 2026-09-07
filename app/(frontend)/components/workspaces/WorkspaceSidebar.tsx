"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { useWorkspace } from "../../../hooks/useWorkspaces";

const WorkspaceSidebar = () => {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;

  const { data, isLoading } = useWorkspace(workspaceId);

  const basePath = `/user/workspaces/${workspaceId}`;
  const navItems = [
    {
      name: "Overview",
      href: basePath,
    },
    {
      name: "Projects",
      href: `${basePath}/projects`,
    },
    {
      name: "Members",
      href: `${basePath}/members`,
    },
    {
      name: "Invitations",
      href: `${basePath}/invitations`,
    },
    {
      name: "Settings",
      href: `${basePath}/settings`,
    },
  ];

  return (
    <aside className="min-h-screen w-64 bg-gray-200 p-4 shadow-md">
      <div className="mb-6">
        <h2 className="font-bold">
          {isLoading ? "Loading..." : data?.workspace?.name}
        </h2>

        <p className="text-sm text-gray-500">Workspace</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 transition ${
                isActive
                  ? "bg-slate-50 text-primary-content font-medium"
                  : "hover:bg-gray-300"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default WorkspaceSidebar;
