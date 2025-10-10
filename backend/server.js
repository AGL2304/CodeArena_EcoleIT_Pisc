import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Message from "./models/Message.js";

// Charger les variables d'environnement
dotenv.config();

// ✅ Debug .env
console.log("🔍 MONGODB_URI =", process.env.MONGODB_URI);

// ✅ Import des routes
import authRoutes from "./routes/authRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

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
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  credentials: true
}));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/challenge", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/test", testRoutes);
app.use("/api/messages", messageRoutes);

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

// Gestion des salles multijoueurs et messagerie
const rooms = {}; // { roomId: { socketId: { username, score, userId } } }
const typingUsers = {}; // { roomId: Set([userId]) }

io.on("connection", (socket) => {
  console.log(`✅ Nouvelle connexion Socket.io: ${socket.id}`);

  // Rejoindre une salle
  socket.on("joinRoom", ({ roomId, username, userId }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;
    socket.username = username;

    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][socket.id] = { username, score: 0, userId };

    // Diffuser les participants mis à jour
    io.to(roomId).emit("roomUpdate", rooms[roomId]);
    
    // Message système de bienvenue
    io.to(roomId).emit("systemMessage", {
      content: `${username} a rejoint la conversation`,
      timestamp: new Date()
    });

    console.log(`👤 ${username} a rejoint la salle ${roomId}`);
  });

  // Rejoindre un concours
  socket.on("join-contest", (contestId) => {
    socket.join(`contest-${contestId}`);
    console.log(`👤 Utilisateur ${socket.id} a rejoint le concours ${contestId}`);
  });

  // ========== MESSAGERIE ==========
  
  // Envoi d'un message
  socket.on("sendMessage", async ({ roomId, content, userId, username, type = "text" }) => {
    try {
      // Validation
      if (!content || content.trim().length === 0) {
        socket.emit("messageError", { error: "Le message ne peut pas être vide" });
        return;
      }

      if (content.length > 1000) {
        socket.emit("messageError", { error: "Message trop long (max 1000 caractères)" });
        return;
      }

      // Sauvegarder en base de données
      const message = new Message({
        roomId,
        userId,
        username,
        content: content.trim(),
        type
      });

      await message.save();

      // Diffuser le message à tous les utilisateurs de la salle
      io.to(roomId).emit("newMessage", {
        _id: message._id,
        roomId: message.roomId,
        userId: message.userId,
        username: message.username,
        content: message.content,
        type: message.type,
        timestamp: message.timestamp,
        isEdited: message.isEdited,
        reactions: message.reactions
      });

      console.log(`💬 Message de ${username} dans ${roomId}: ${content.substring(0, 50)}...`);
    } catch (error) {
      console.error("❌ Erreur envoi message:", error);
      socket.emit("messageError", { error: "Erreur lors de l'envoi du message" });
    }
  });

  // Utilisateur en train de taper
  socket.on("typing", ({ roomId, userId, username }) => {
    if (!typingUsers[roomId]) typingUsers[roomId] = new Set();
    typingUsers[roomId].add(userId);

    socket.to(roomId).emit("userTyping", {
      userId,
      username,
      isTyping: true
    });
  });

  // Utilisateur a arrêté de taper
  socket.on("stopTyping", ({ roomId, userId }) => {
    if (typingUsers[roomId]) {
      typingUsers[roomId].delete(userId);
    }

    socket.to(roomId).emit("userTyping", {
      userId,
      isTyping: false
    });
  });

  // Marquer les messages comme lus
  socket.on("markAsRead", ({ roomId, userId }) => {
    socket.to(roomId).emit("messagesRead", {
      userId,
      roomId,
      timestamp: new Date()
    });
  });

  // ========== FIN MESSAGERIE ==========

  // Mettre à jour le score
  socket.on("updateScore", ({ roomId, score }) => {
    if (rooms[roomId] && rooms[roomId][socket.id]) {
      rooms[roomId][socket.id].score = score;

      const sortedParticipants = Object.fromEntries(
        Object.entries(rooms[roomId]).sort(([, a], [, b]) => b.score - a.score)
      );

      io.to(roomId).emit("roomUpdate", sortedParticipants);
    }
  });

  // Quitter une salle
  socket.on("leaveRoom", ({ roomId }) => {
    if (rooms[roomId] && rooms[roomId][socket.id]) {
      const username = rooms[roomId][socket.id].username;
      delete rooms[roomId][socket.id];
      
      io.to(roomId).emit("roomUpdate", rooms[roomId]);
      io.to(roomId).emit("systemMessage", {
        content: `${username} a quitté la conversation`,
        timestamp: new Date()
      });

      socket.leave(roomId);
      console.log(`👋 ${username} a quitté la salle ${roomId}`);
    }
  });

  // Déconnexion
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        const username = rooms[roomId][socket.id].username;
        delete rooms[roomId][socket.id];
        
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
        io.to(roomId).emit("systemMessage", {
          content: `${username} s'est déconnecté`,
          timestamp: new Date()
        });
      }
    }

    // Nettoyer les indicateurs de frappe
    if (socket.roomId && typingUsers[socket.roomId]) {
      typingUsers[socket.roomId].delete(socket.userId);
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
const PORT = process.env.PORT || 5010;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📡 Environnement: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`💬 Messagerie instantanée activée`);
    });
  } catch (error) {
    console.error("❌ Erreur au démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();

export { app, io };