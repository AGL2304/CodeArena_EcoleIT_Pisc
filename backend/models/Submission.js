import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  code: String,
  language: { type: String, enum: ['python','javascript'], default: 'javascript' },
  score: Number,
  status: { type: String, enum: ['Pending','Success','Failed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Submission', submissionSchema);
