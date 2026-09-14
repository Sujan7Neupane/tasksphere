"use client";

import { useEffect } from "react";
import socket from "./socket";

const ChatTest = ({ workspaceId }: { workspaceId: string }) => {
  useEffect(() => {
    socket.emit("join-workspace", workspaceId);

    socket.on("new-message", (message) => {
      console.log("New message:", message);
    });

    return () => {
      socket.off("new-message");
    };
  }, [workspaceId]);

  const sendMessage = async () => {
    const response = await fetch(`/api/workspaces/${workspaceId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "Hello from Socket.IO!",
      }),
    });

    const result = await response.json();

    if (response.ok) {
      socket.emit("send-message", {
        workspaceId,
        message: result.data,
      });
    }
  };

  return (
    <div>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default ChatTest;
