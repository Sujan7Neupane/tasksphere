import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: `${process.env.BASE_URL}`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

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
    console.log("User disconnected:", socket.id);
  });
});

console.log("Socket.IO server running on port 3001");
