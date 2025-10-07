import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import testRoutes from "./routes/testRoutes.js";


// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app = express();
const server = http.createServer(app);

// Configurer Socket.io avec CORS amélioré
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});84



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use("/api/test", testRoutes);

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);

// Route principale améliorée
app.get("/", (req, res) => {  
  res.json({
    message: "🎮 Hello CodeArena! Backend is running...",
    version: "1.0.0",
    status: "operational",
    timestamp: new Date().toISOString()
  });
});

// Route de santé
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Endpoint test utilisateurs
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ]);
});

// Gestion des salles multijoueurs
const rooms = {}; // { roomId: { socketId: { username, score } } }

io.on("connection", (socket) => {
  console.log(`✅ Nouvelle connexion Socket.io: ${socket.id}`);

  // Rejoindre une salle
  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][socket.id] = { username, score: 0 };

    // Diffuser les participants mis à jour
    io.to(roomId).emit("roomUpdate", rooms[roomId]);
    console.log(`👤 ${username} a rejoint la salle ${roomId}`);
  });

  // Rejoindre un concours (feature additionnelle)
  socket.on("join-contest", (contestId) => {
    socket.join(`contest-${contestId}`);
    console.log(`👤 Utilisateur ${socket.id} a rejoint le concours ${contestId}`);
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
      console.log(`👋 Utilisateur a quitté la salle ${roomId}`);
    }
  });

  // Déconnexion
  socket.on("disconnect", () => {
    // Nettoyer toutes les salles
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id];
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
      }
    }
    console.log(`❌ Déconnexion: ${socket.id}`);
  });
});

// Rendre io accessible dans les routes
app.set("io", io);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.originalUrl
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Erreur serveur",
    message: process.env.NODE_ENV === "development" ? err.message : "Une erreur est survenue"
  });
});

// Connexion MongoDB et démarrage du serveur
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Démarrage du serveur
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📡 Environnement: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur au démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();

export { app, io };