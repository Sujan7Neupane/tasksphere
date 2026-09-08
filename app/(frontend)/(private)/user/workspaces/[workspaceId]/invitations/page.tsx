"use client";

import { useParams } from "next/navigation";
import {
  useCancelInvitation,
  useInvitations,
} from "../../../../../../hooks/useInvitations";
import { useState } from "react";
import CreateInvitationModal from "../../../../../components/invitations/CreateInvitationModal";
import Button from "../../../../../components/ui/Button";
import toast from "react-hot-toast";
import axios from "axios";
import { useWorkspace } from "../../../../../../hooks/useWorkspaces";

const InvitationsPage = () => {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  //   console.log(workspaceId);

  const { data: workspace } = useWorkspace(workspaceId);

  const canManageInvitations =
    workspace?.role === "OWNER" || workspace?.role === "ADMIN";

  const {
    data: invitations,
    isLoading,
    isError,
  } = useInvitations(workspaceId, canManageInvitations);
  //   console.log(invitations);
  const cancelInvitation = useCancelInvitation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancelInvitation = (invitationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this invitation?",
    );

    if (!confirmed) {
      return;
    }

    cancelInvitation.mutate(
      {
        workspaceId,
        invitationId,
      },
      {
        onSuccess: () => {
          toast.success("Invitation cancelled");
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to cancel invitation",
            );
          } else {
            toast.error("Failed to cancel invitation");
          }
        },
      },
    );
  };

  if (!workspace) {
    return <div className="p-6">Loading workspace...</div>;
  }

  if (!canManageInvitations) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Invitations</h1>

        <p className="mt-2 text-gray-500">
          You do not have permission to invite members.
        </p>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="p-6">Loading invitations...</div>
      ) : isError ? (
        <div className="p-6 text-red-500">Failed to load invitations.</div>
      ) : (
        <div className="p-6 ">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Invitations</h1>

              <p className="text-gray-500">
                Manage invitations for this workspace.
              </p>
            </div>

            <Button
              className="bg-secondary"
              onClick={() => setIsModalOpen(true)}
            >
              Invite Member
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Email</th>

                  <th className="px-4 py-3 text-left">Status</th>

                  <th className="px-4 py-3 text-left">Expires</th>

                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {invitations?.map((invitation) => (
                  <tr key={invitation.id} className="border-t">
                    <td className="px-4 py-3">{invitation.email}</td>

                    <td className="px-4 py-3">{invitation.status}</td>

                    <td className="px-4 py-3">
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(invitation.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleCancelInvitation(invitation.id)}
                        disabled={cancelInvitation.isPending}
                        className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {invitations?.length === 0 && (
              <p className="p-6 text-center text-gray-500">
                No pending invitations.
              </p>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <CreateInvitationModal
          workspaceId={workspaceId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default InvitationsPage;
