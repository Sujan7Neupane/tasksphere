"use client";

import { Bell } from "lucide-react";
import {
  useMarkNotificationAsRead,
  useNotifications,
} from "../../../hooks/useNotifications";
import Button from "../ui/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import socket from "../chat/socket";

const NotificationBell = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();

  const unreadCount = data?.unreadCount || 0;

  const handleNotificationClick = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [queryClient]);

  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        className="btn btn-ghost btn-circle bg-gray-200"
        aria-label="Notifications"
      >
        <div className="indicator">
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="badge badge-error badge-xs indicator-item">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      <div
        tabIndex={0}
        className="dropdown-content z-1 mt-3 w-80 rounded-md border border-base-300 bg-base-100 shadow-lg"
      >
        <div className="border-b border-base-300 px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-sm text-base-content/70">
              Loading notifications...
            </p>
          ) : data?.data.length === 0 ? (
            <p className="p-4 text-sm text-base-content/70">
              No notifications.
            </p>
          ) : (
            data?.data.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleNotificationClick(notification.id)}
                className={`w-full border-b border-base-300 px-4 py-3 text-left ${
                  !notification.isRead ? "bg-base-200" : ""
                }`}
              >
                <p className="text-sm">{notification.message}</p>

                <p className="mt-1 text-xs text-base-content/60">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
