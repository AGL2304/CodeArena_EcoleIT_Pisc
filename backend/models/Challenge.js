import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  difficulty: { type: String, enum: ['Facile','Moyen','Difficile'], default: 'Facile' },
  
  // 🔹 testCases avec types flexibles
  testCases: [
    {
      input: { type: mongoose.Schema.Types.Mixed }, // Accepte tout type
      expectedOutput: { type: mongoose.Schema.Types.Mixed } // Accepte tout type
    }
  ],
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Challenge', challengeSchema);