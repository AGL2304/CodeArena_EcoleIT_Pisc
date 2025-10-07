import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  code: { type: String, required: true },
  language: { type: String, enum: ['python', 'javascript'], default: 'javascript' },
  languageVersion: { type: String }, // facultatif, ex: "Python 3.11"
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  output: { type: String },           // sortie réelle après exécution
  expectedOutput: { type: String },   // sortie attendue pour comparaison
  error: { type: String },            // erreurs d’exécution
  timeTaken: { type: Number },        // durée en millisecondes
  createdAt: { type: Date, default: Date.now }
});

// Index pour rechercher rapidement les soumissions par challenge et utilisateur
submissionSchema.index({ challenge: 1, user: 1 });

export default mongoose.model('Submission', submissionSchema);
