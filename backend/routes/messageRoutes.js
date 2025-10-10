import express from "express";
import Message from "../models/Message.js";
import { authenticateToken } from "../middlewares/auth.js"; // Assurez-vous d'avoir ce middleware

const router = express.Router();

// Récupérer les messages d'une salle
router.get("/room/:roomId", authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, before } = req.query;

    const query = { roomId };
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate("userId", "username avatar");

    res.json({
      success: true,
      messages: messages.reverse(),
      count: messages.length
    });
  } catch (error) {
    console.error("❌ Erreur récupération messages:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des messages"
    });
  }
});

// Supprimer un message (seulement l'auteur)
router.delete("/:messageId", authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      _id: messageId,
      userId: userId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message non trouvé ou non autorisé"
      });
    }

    await message.deleteOne();

    // Notifier via Socket.io
    const io = req.app.get("io");
    io.to(message.roomId).emit("messageDeleted", {
      messageId,
      roomId: message.roomId
    });

    res.json({
      success: true,
      message: "Message supprimé"
    });
  } catch (error) {
    console.error("❌ Erreur suppression message:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression"
    });
  }
});

// Modifier un message
router.patch("/:messageId", authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Le contenu ne peut pas être vide"
      });
    }

    const message = await Message.findOne({
      _id: messageId,
      userId: userId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message non trouvé ou non autorisé"
      });
    }

    message.content = content;
    message.isEdited = true;
    await message.save();

    // Notifier via Socket.io
    const io = req.app.get("io");
    io.to(message.roomId).emit("messageEdited", {
      messageId,
      content,
      roomId: message.roomId,
      isEdited: true
    });

    res.json({
      success: true,
      message
    });
  } catch (error) {
    console.error("❌ Erreur modification message:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la modification"
    });
  }
});

// Ajouter une réaction
router.post("/:messageId/reaction", authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message non trouvé"
      });
    }

    // Vérifier si l'utilisateur a déjà réagi avec cet emoji
    const existingReaction = message.reactions.find(
      r => r.userId.toString() === userId && r.emoji === emoji
    );

    if (existingReaction) {
      // Retirer la réaction
      message.reactions = message.reactions.filter(
        r => !(r.userId.toString() === userId && r.emoji === emoji)
      );
    } else {
      // Ajouter la réaction
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    // Notifier via Socket.io
    const io = req.app.get("io");
    io.to(message.roomId).emit("messageReaction", {
      messageId,
      reactions: message.reactions,
      roomId: message.roomId
    });

    res.json({
      success: true,
      reactions: message.reactions
    });
  } catch (error) {
    console.error("❌ Erreur réaction:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'ajout de la réaction"
    });
  }
});

export default router;
