"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CreateTaskForm from "../../../../../../components/CreateTaskForm";

const CreateTaskPage = () => {
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectId as string;

  const handleSuccess = () => {
    toast.success("Task created successfully");
    router.push(`/user/projects/${projectId}`);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <CreateTaskForm projectId={projectId} onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateTaskPage;
