import express from "express";import express from "express";

import http from "http";import http from "http";

import { Server } from "socket.io";import { Server } from "socket.io";

import mongoose from "mongoose";import mongoose from "mongoose";

import cors from "cors";import cors from "cors";

import dotenv from "dotenv";import dotenv from "dotenv";



import authRoutes from "./routes/authRoutes.js";import authRoutes from "./routes/authRoutes.js";

import challengeRoutes from "./routes/challengeRoutes.js";import challengeRoutes from "./routes/challengeRoutes.js";

import submissionRoutes from "./routes/submissionRoutes.js";import submissionRoutes from "./routes/submissionRoutes.js";

import testRoutes from "./routes/testRoutes.js";import testRoutes from "./routes/testRoutes.js";



// Configuration de base// Configuration de base

dotenv.config();dotenv.config();



// Constantesconst PORT = process.env.PORT || 3000;

const PORT = process.env.PORT || 3000;const MONGODB_URI = 'mongodb://127.0.0.1:27017/codearena';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/codearena';

// Créer l'application Express

// Créer l'application Expressconst app = express();

const app = express();const server = http.createServer(app);

const server = http.createServer(app);

// Connexion à MongoDB

// Configuration CORS pour Socket.ioconst MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/codearena";

const io = new Server(server, {console.log('Tentative de connexion à MongoDB avec URI:', MONGODB_URI);

  cors: {

    origin: process.env.FRONTEND_URL || "http://localhost:5173",mongoose.connect(MONGODB_URI, {

    methods: ["GET", "POST"],  useNewUrlParser: true,

    credentials: true  useUnifiedTopology: true,

  }  serverSelectionTimeoutMS: 5000,

});  retryWrites: true,

  w: 'majority'

// Middlewares})

app.use(express.json());.then(() => {

app.use(express.urlencoded({ extended: true }));  console.log('✅ Connecté à MongoDB avec succès!');

app.use(cors({})

  origin: "*",.catch((err) => {

  credentials: true  console.error('❌ Erreur de connexion à MongoDB:', err);

}));  process.exit(1);

});

// Routes API

app.use("/api/auth", authRoutes);// Configurer Socket.io avec CORS amélioré

app.use("/api/challenges", challengeRoutes);const io = new Server(server, {

app.use("/api/submissions", submissionRoutes);  cors: {

app.use("/api/test", testRoutes);    origin: process.env.FRONTEND_URL || "http://localhost:5173",

    methods: ["GET", "POST"],

// Route principale    credentials: true

app.get("/", (req, res) => {    }

  res.json({});84

    message: "🎮 Hello CodeArena! Backend is running...",

    version: "1.0.0",

    status: "operational",

    timestamp: new Date().toISOString()// Middlewares

  });app.use(express.json());

});app.use(express.urlencoded({ extended: true }));

app.use(cors({

// Route de santé  origin: "*",

app.get("/api/health", (req, res) => {  credentials: true

  res.json({}));

    status: "healthy",app.use("/api/test", testRoutes);

    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",

    uptime: process.uptime(),// Routes API

    timestamp: new Date().toISOString()app.use("/api/auth", authRoutes);

  });app.use("/api/challenges", challengeRoutes);

});app.use("/api/submissions", submissionRoutes);



// Gestion des salles multijoueurs// Route principale améliorée

const rooms = {};app.get("/", (req, res) => {  

  res.json({

io.on("connection", (socket) => {    message: "🎮 Hello CodeArena! Backend is running...",

  console.log(`✅ Nouvelle connexion Socket.io: ${socket.id}`);    version: "1.0.0",

    status: "operational",

  socket.on("joinRoom", ({ roomId, username }) => {    timestamp: new Date().toISOString()

    socket.join(roomId);  });

    if (!rooms[roomId]) rooms[roomId] = {};});

    rooms[roomId][socket.id] = { username, score: 0 };

    io.to(roomId).emit("roomUpdate", rooms[roomId]);// Route de santé

  });app.get("/api/health", (req, res) => {

  res.json({

  socket.on("updateScore", ({ roomId, score }) => {    status: "healthy",

    if (rooms[roomId]?.[socket.id]) {    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",

      rooms[roomId][socket.id].score = score;    uptime: process.uptime(),

      const sortedParticipants = Object.fromEntries(    timestamp: new Date().toISOString()

        Object.entries(rooms[roomId]).sort(([, a], [, b]) => b.score - a.score)  });

      );});

      io.to(roomId).emit("roomUpdate", sortedParticipants);

    }// Endpoint test utilisateurs

  });app.get("/api/users", (req, res) => {

  res.json([

  socket.on("disconnect", () => {    { id: 1, name: "Alice" },

    Object.keys(rooms).forEach(roomId => {    { id: 2, name: "Bob" }

      if (rooms[roomId]?.[socket.id]) {  ]);

        delete rooms[roomId][socket.id];});

        io.to(roomId).emit("roomUpdate", rooms[roomId]);

      }// Gestion des salles multijoueurs

    });const rooms = {}; // { roomId: { socketId: { username, score } } }

  });

});io.on("connection", (socket) => {

  console.log(`✅ Nouvelle connexion Socket.io: ${socket.id}`);

// Connexion MongoDB et démarrage du serveur

const startServer = async () => {  // Rejoindre une salle

  try {  socket.on("joinRoom", ({ roomId, username }) => {

    await mongoose.connect(MONGODB_URI, {    socket.join(roomId);

      useNewUrlParser: true,    if (!rooms[roomId]) rooms[roomId] = {};

      useUnifiedTopology: true    rooms[roomId][socket.id] = { username, score: 0 };

    });

        // Diffuser les participants mis à jour

    console.log("✅ Connecté à MongoDB");    io.to(roomId).emit("roomUpdate", rooms[roomId]);

        console.log(`👤 ${username} a rejoint la salle ${roomId}`);

    server.listen(PORT, () => {  });

      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);

    });  // Rejoindre un concours (feature additionnelle)

  } catch (error) {  socket.on("join-contest", (contestId) => {

    console.error("❌ Erreur de démarrage:", error);    socket.join(`contest-${contestId}`);

    process.exit(1);    console.log(`👤 Utilisateur ${socket.id} a rejoint le concours ${contestId}`);

  }  });

};

  // Mettre à jour le score

startServer();  socket.on("updateScore", ({ roomId, score }) => {
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