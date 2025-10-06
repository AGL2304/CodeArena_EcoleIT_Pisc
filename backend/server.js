import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("Hello CodeArena 🚀");
});

// Endpoint test
app.get("/api/users", (req, res) => {
  // Exemple : renvoyer un tableau d'utilisateurs fictifs
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ]);
});



// Gestion des salles multijoueurs
const rooms = {}; // { roomId: { socketId: { username, score } } }

io.on("connection", (socket) => {
  console.log("Nouvelle connexion:", socket.id);

  // Rejoindre une salle
  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][socket.id] = { username, score: 0 };

    // Diffuser les participants mis à jour
    io.to(roomId).emit("roomUpdate", rooms[roomId]);
    console.log(`${username} a rejoint la salle ${roomId}`);
  });

  // Mettre à jour le score
  socket.on("updateScore", ({ roomId, score }) => {
    if (rooms[roomId] && rooms[roomId][socket.id]) {
      rooms[roomId][socket.id].score = score;

      // Trier par score décroissant pour classement live
      const sortedParticipants = Object.fromEntries(
        Object.entries(rooms[roomId]).sort(([, a], [, b]) => b.score - a.score)
      );

      io.to(roomId).emit("roomUpdate", sortedParticipants);
    }
  });

  // Quitter une salle
  socket.on("leaveRoom", ({ roomId }) => {
    if (rooms[roomId] && rooms[roomId][socket.id]) {
      delete rooms[roomId][socket.id];
      io.to(roomId).emit("roomUpdate", rooms[roomId]);
      socket.leave(roomId);
      console.log(`Utilisateur a quitté la salle ${roomId}`);
    }
  });

  // Déconnexion
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id];
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
      }
    }
    console.log("Utilisateur déconnecté:", socket.id);
  });
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
