"use client";

import { useParams } from "next/navigation";
import {
  useMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "../../../../../../hooks/useMembers";
import toast from "react-hot-toast";
import Button from "../../../../../components/ui/Button";
import { useEffect, useState } from "react";
import socket from "../../../../../components/chat/socket";
import { useSession } from "next-auth/react";

const MembersPage = () => {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  //   console.log(workspaceId);

  const { data: members, isLoading, isError } = useMembers(workspaceId);
  //   console.log(members);

  const updateMemberRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const { data: session } = useSession();

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }

    socket.emit("user-online", session.user.id);

    socket.on("online-users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("user-online", (userId: string) => {
      setOnlineUsers((currentUsers) => [...new Set([...currentUsers, userId])]);
    });

    socket.on("user-offline", (userId: string) => {
      setOnlineUsers((currentUsers) =>
        currentUsers.filter((id) => id !== userId),
      );
    });

    return () => {
      socket.off("online-users");
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, [session?.user?.id]);

  const handleRoleChange = (userId: string, role: "ADMIN" | "MEMBER") => {
    updateMemberRole.mutate(
      {
        workspaceId,
        userId,
        role,
      },
      {
        onSuccess: () => {
          toast.success("Member role updated");
        },
        onError: () => {
          toast.error("Failed to update member role");
        },
      },
    );
  };

  const handleRemoveMember = (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member?",
    );

    if (!confirmed) {
      return;
    }

    removeMember.mutate(
      {
        workspaceId,
        userId,
      },
      {
        onSuccess: () => {
          toast.success("Member removed");
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      },
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="p-6">Loading members...</div>
      ) : isError ? (
        <div className="p-6 text-red-500">Failed to load members.</div>
      ) : (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Members</h1>
            <p className="text-gray-500">Manage members of this workspace.</p>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {members?.map((member) => (
                  <tr key={member.userId} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            onlineUsers.includes(member.userId)
                              ? "bg-success"
                              : "bg-base-300"
                          }`}
                        />

                        <span>{member.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">{member.email}</td>

                    <td className="px-4 py-3">{member.role}</td>

                    <td className="px-4 py-3">
                      {member.role === "OWNER" ? (
                        <span>OWNER</span>
                      ) : (
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(
                              member.userId,
                              e.target.value as "ADMIN" | "MEMBER",
                            )
                          }
                          disabled={updateMemberRole.isPending}
                          className="rounded-md border px-2 py-1 cursor-pointer"
                        >
                          <option value="MEMBER">MEMBER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {member.role === "OWNER" ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => handleRemoveMember(member.userId)}
                          disabled={removeMember.isPending}
                          className="text-red-500 hover:text-red-600 cursor-pointer btn-outline"
                        >
                          Remove
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default MembersPage;
