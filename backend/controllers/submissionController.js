import Submission from "../models/Submission.js";

// Créer une submission
export const createSubmission = async (req, res) => {
  try {
    const { userId, challengeId, code, language, score } = req.body;

    if (!userId || !challengeId || !code) {
      return res.status(400).json({ message: "userId, challengeId et code sont requis" });
    }

    const submission = new Submission({
      user: userId,          // 🔹 correspond au champ 'user' du schéma
      challenge: challengeId, // 🔹 correspond au champ 'challenge' du schéma
      code,
      language: language || "javascript",
      score: score || 0
    });

    await submission.save();
    res.status(201).json({ message: "Submission créée", submission });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer toutes les submissions d'un utilisateur
export const getSubmissionsByUser = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.params.userId })
      .populate("challenge", "title description");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer toutes les submissions pour un challenge
export const getSubmissionsByChallenge = async (req, res) => {
  try {
    const submissions = await Submission.find({ challenge: req.params.challengeId })
      .populate("user", "username email");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
