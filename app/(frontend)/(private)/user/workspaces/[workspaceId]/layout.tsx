import { ReactNode } from "react";
import WorkspaceSidebar from "../../../../components/workspaces/WorkspaceSidebar";

interface WorkspaceLayoutProps {
  children: ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <WorkspaceSidebar />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
