"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMessages, useSendMessage } from "../../../hooks/useMessages";
import socket from "./socket";
import { Message } from "../../../types/message.types";
import { useQueryClient } from "@tanstack/react-query";

interface WorkspaceChatProps {
  workspaceId: string;
  currentUserId: string;
}
const WorkspaceChat = ({ workspaceId, currentUserId }: WorkspaceChatProps) => {
  const [content, setContent] = useState("");

  const { data, isLoading, isError } = useMessages(workspaceId);
  const sendMessageMutation = useSendMessage(workspaceId);

  const queryClient = useQueryClient();

  useEffect(() => {
    // console.log("Joining workspace:", workspaceId);

    socket.emit("join-workspace", workspaceId);

    const handleNewMessage = (message: Message) => {
      //   console.log("New message received:", message);

      queryClient.setQueryData(
        ["messages", workspaceId],
        (oldData: { data: Message[] } | undefined) => {
          if (!oldData) {
            return { data: [message] };
          }

          return {
            data: [...oldData.data, message],
          };
        },
      );
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [workspaceId, queryClient]);

  const handleSendMessage = () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return;
    }
    sendMessageMutation.mutate(
      {
        content: trimmedContent,
      },
      {
        onSuccess: (response) => {
          setContent("");

          socket.emit("send-message", {
            workspaceId,
            message: response.data,
          });
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to send message.";

          toast.error(message);
        },
      },
    );
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };
  return (
    <div className="flex h-150 flex-col rounded-lg border border-base-300 bg-base-100">
      <div className="border-b border-base-300 px-4 py-4">
        <h2 className="font-semibold">Workspace Chat</h2>
        <p className="mt-1 text-sm text-base-content/60">
          Chat with members of this workspace.
        </p>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {isLoading ? (
          <p className="text-center text-sm text-base-content/60">
            Loading messages...
          </p>
        ) : isError ? (
          <p className="text-center text-sm text-error">
            Failed to load messages.
          </p>
        ) : data?.data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-base-content/60">
              No messages yet. Start the conversation.
            </p>
          </div>
        ) : (
          data?.data.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[75%]">
                  <div
                    className={`mb-1 flex items-center gap-2 text-xs text-base-content/60 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <span className="font-medium">
                      {isCurrentUser
                        ? "You"
                        : message.sender.name || "Unknown User"}
                    </span>

                    <div
                      className={`mb-1 flex items-center gap-2 text-xs text-base-content/60 ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>
                        {new Date(message.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`rounded-lg px-3 py-2 ${isCurrentUser ? "bg-primary text-primary-content" : "bg-base-200"}`}
                  >
                    <p className="wrap-break-words text-sm">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="border-t border-base-300 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            disabled={sendMessageMutation.isPending}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || !content.trim()}
            className="btn btn-primary"
          >
            {sendMessageMutation.isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default WorkspaceChat;
