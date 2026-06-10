import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import http from "http";
import { Server } from "socket.io";
import { setIO } from "./socket/socket.js";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());

const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "../uploads"
    )
  )
);

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST"],
  },
});
setIO(io);
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(
    "User Connected:",
    socket.id
  );

  socket.on(
  "join",
  (userId) => {
    console.log(
      "JOIN USER:",
      userId
    );
    onlineUsers.set(
      userId,
      socket.id
    );

    User.findByIdAndUpdate(
      userId,
      {
        online: true,
      }
    );

    io.emit(
      "online_users",
      Array.from(
        onlineUsers.keys()
      )
    );
  }
);

  socket.on(
  "typing",
  (data) => {
    socket.broadcast.emit(
      "user_typing",
      data
    );
  }
);

  socket.on(
  "disconnect",
  async () => {
      for (const [
        userId,
        socketId,
      ] of onlineUsers) {
        if (
  socketId ===
  socket.id
) {

  await User.findByIdAndUpdate(
  userId,
  {
    online: false,
    lastSeen: new Date(),
  }
);

console.log(
  "LAST SEEN SAVED:",
  userId
);

  onlineUsers.delete(
    userId
  );

  break;
}
      }

      io.emit(
        "online_users",
        Array.from(
          onlineUsers.keys()
        )
      );

      console.log(
        "User Disconnected:",
        socket.id
      );
    }
  );
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Realtime Chat Backend Running 🚀",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/users",
  userRoutes
);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});