"use client";

import toast from "react-hot-toast";
import {
  useAdminUsers,
  useDeleteUser,
  useUpdateUserStatus,
} from "../../../../hooks/userAdminUsers";
import { useState } from "react";
import Button from "../../../components/ui/Button";

const AdminUsersPage = () => {
  const { data, isLoading, isError } = useAdminUsers();

  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const updateStatus = useUpdateUserStatus();
  const deleteUser = useDeleteUser();

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    setUpdatingUserId(userId);

    updateStatus.mutate(
      {
        userId,
        isActive: !currentStatus,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Something went wrong");
        },
        onSettled: () => {
          setUpdatingUserId(null);
        },
      },
    );
  };

  const handleDelete = (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    deleteUser.mutate(userId, {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Something went wrong");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-error">Failed to load users.</div>;
  }

  return (
    <div className="space-y-6 m-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-base-content/70">
          Manage TaskSphere platform users.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-base-300">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Platform Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-300">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={`badge ${
                      user.platformRole === "ADMIN"
                        ? "badge-primary"
                        : "badge-ghost"
                    }`}
                  >
                    {user.platformRole}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge rounded-md ${
                      user.isActive ? "badge-success" : "badge-error"
                    }`}
                  >
                    {user.isActive ? "Active" : "Disabled"}
                  </span>
                </td>

                <td>
                  <div className="flex justify-end gap-2">
                    {user.platformRole !== "ADMIN" && (
                      <>
                        <Button
                          type="button"
                          className="btn btn-sm btn-success text-white"
                          disabled={updatingUserId === user.id}
                          onClick={() =>
                            handleToggleStatus(user.id, user.isActive)
                          }
                        >
                          {updatingUserId === user.id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : user.isActive ? (
                            "Disable"
                          ) : (
                            "Enable"
                          )}
                        </Button>

                        <button
                          type="button"
                          className="btn btn-sm btn-error rounded-sm text-white"
                          disabled={deleteUser.isPending}
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.users.length === 0 && (
        <div className="py-10 text-center text-base-content/60">
          No users found.
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
