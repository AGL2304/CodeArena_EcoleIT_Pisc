import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  difficulty: { type: String, enum: ['Easy','Medium','Hard'], default: 'Easy' },
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Challenge', challengeSchema);
