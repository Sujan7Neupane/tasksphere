import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: `${process.env.BASE_URL}`,
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user-online", (userId: string) => {
    onlineUsers.set(userId, socket.id);

    console.log("User online:", userId);

    io.emit("user-online", userId);

    socket.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("join-workspace", (workspaceId: string) => {
    socket.join(`workspace:${workspaceId}`);

    console.log(`Socket ${socket.id} joined workspace:${workspaceId}`);
  });

  socket.on(
    "send-message",
    ({ workspaceId, message }: { workspaceId: string; message: object }) => {
      io.to(`workspace:${workspaceId}`).emit("new-message", message);
    },
  );

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);

        console.log("User offline:", userId);

        io.emit("user-offline", userId);

        break;
      }
    }

    console.log("User disconnected:", socket.id);
  });
});

console.log("Socket.IO server running on port 3001");
