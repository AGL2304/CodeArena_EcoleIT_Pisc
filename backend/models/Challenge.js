import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  difficulty: { type: String, enum: ['Facile','Moyen','Difficile'], default: 'Facile' },
  
  // 🔹 Exemples visibles pour l'utilisateur
  examples: [
    {
      input: { type: mongoose.Schema.Types.Mixed },
      output: { type: mongoose.Schema.Types.Mixed },
      explanation: { type: String } // Optionnel
    }
  ],
  
  // 🔹 Test cases pour validation (cachés)
  testCases: [
    {
      input: { type: mongoose.Schema.Types.Mixed },
      expectedOutput: { type: mongoose.Schema.Types.Mixed }
    }
  ],
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Challenge', challengeSchema);