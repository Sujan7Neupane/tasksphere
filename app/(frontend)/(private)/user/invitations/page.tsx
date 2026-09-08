"use client";

import axios from "axios";
import toast from "react-hot-toast";

import {
  useAcceptInvitation,
  useMyInvitations,
} from "../../../../hooks/useInvitations";
import Button from "../../../components/ui/Button";

const MyInvitationsPage = () => {
  const { data: invitations, isLoading, isError } = useMyInvitations();

  const acceptInvitation = useAcceptInvitation();

  const handleAccept = (token: string) => {
    acceptInvitation.mutate(token, {
      onSuccess: () => {
        toast.success("Invitation accepted");
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
    <>
      {isLoading ? (
        <div className="p-6">Loading invitations...</div>
      ) : isError ? (
        <div className="p-6 text-red-500">Failed to load invitations.</div>
      ) : (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">My Invitations</h1>

            <p className="text-gray-500">
              View invitations you have received to join workspaces.
            </p>
          </div>

          {invitations?.length === 0 ? (
            <div className="rounded-lg border p-6 text-center text-gray-500">
              You have no pending invitations.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Workspace</th>

                    <th className="px-4 py-3 text-left">Invited By</th>

                    <th className="px-4 py-3 text-left">Expires</th>

                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {invitations?.map((invitation) => (
                    <tr key={invitation.id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {invitation.workspace.name}
                        </div>

                        {invitation.workspace.description && (
                          <div className="text-sm text-gray-500">
                            {invitation.workspace.description}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">{invitation.invitedBy.name}</td>

                      <td className="px-4 py-3">
                        {new Date(invitation.expiresAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          onClick={() => handleAccept(invitation.token)}
                          disabled={acceptInvitation.isPending}
                          className="rounded-md px-3 py-1 text-sm text-white cursor-pointer"
                        >
                          {acceptInvitation.isPending
                            ? "Accepting..."
                            : "Accept"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MyInvitationsPage;
