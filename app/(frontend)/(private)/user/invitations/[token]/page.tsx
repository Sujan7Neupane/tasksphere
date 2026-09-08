"use client";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useAcceptInvitation } from "../../../../../hooks/useInvitations";

const AcceptInvitationPage = () => {
  const params = useParams();
  const router = useRouter();

  const token = params.token as string;

  const acceptInvitation = useAcceptInvitation();

  const handleAccept = () => {
    acceptInvitation.mutate(token, {
      onSuccess: () => {
        toast.success("Invitation accepted");

        router.push("/user/workspaces");
      },

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to accept invitation",
          );
        } else {
          toast.error("Failed to accept invitation");
        }
      },
    });
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-2 text-2xl font-bold">Workspace Invitation</h1>

      <p className="mb-6 text-gray-600">
        You have been invited to join a workspace.
      </p>

      <button
        type="button"
        onClick={handleAccept}
        disabled={acceptInvitation.isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {acceptInvitation.isPending ? "Accepting..." : "Accept Invitation"}
      </button>
    </div>
  );
};

export default AcceptInvitationPage;
