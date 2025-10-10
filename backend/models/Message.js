import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ["text", "system", "code"],
    default: "text"
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    emoji: String
  }]
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
messageSchema.index({ roomId: 1, timestamp: -1 });

export default mongoose.model("Message", messageSchema);
