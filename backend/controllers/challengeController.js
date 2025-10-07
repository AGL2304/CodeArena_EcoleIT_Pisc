import Challenge from "../models/Challenge.js";
import Leaderboard from "../models/Leaderboard.js";

// Créer un challenge
export const createChallenge = async (req, res) => {
  try {
    const { title, description, testCases } = req.body;
    if (!title || !description || !testCases) {
      return res.status(400).json({ message: "title, description et testCases sont requis" });
    }

    const challenge = new Challenge({ title, description, testCases });
    await challenge.save();
    res.status(201).json({ message: "Challenge créé", challenge });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer tous les challenges
export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer un challenge par ID
export const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: "Challenge non trouvé" });
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Mettre à jour un challenge
export const updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!challenge) return res.status(404).json({ message: "Challenge non trouvé" });
    res.json({ message: "Challenge mis à jour", challenge });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Supprimer un challenge
export const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) return res.status(404).json({ message: "Challenge non trouvé" });
    res.json({ message: "Challenge supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Inscrire un utilisateur à un challenge
export const joinChallenge = async (req, res) => {
  const { userId } = req.body;
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: "Challenge non trouvé" });

    if (!challenge.participants) challenge.participants = [];

    if (!challenge.participants.includes(userId)) {
      challenge.participants.push(userId);
      await challenge.save();
    }

    res.json({ message: "Inscription réussie", challenge });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Lister les participants
export const getParticipants = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate("participants", "username email");
    if (!challenge) return res.status(404).json({ message: "Challenge non trouvé" });

    res.json(challenge.participants || []);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Mettre à jour le score d’un participant
export const updateParticipantScore = async (req, res) => {
  const { userId, score } = req.body;
  try {
    let leaderboard = await Leaderboard.findOne({ challenge: req.params.id });
    if (!leaderboard) {
      leaderboard = new Leaderboard({ challenge: req.params.id, scores: [] });
    }

    const existing = leaderboard.scores.find(s => s.user.toString() === userId);
    if (existing) existing.score = score;
    else leaderboard.scores.push({ user: userId, score });

    await leaderboard.save();
    res.json({ message: "Score mis à jour", leaderboard });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer le leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.findOne({ challenge: req.params.id }).populate("scores.user", "username");
    if (!leaderboard) return res.status(404).json({ message: "Leaderboard non trouvé" });

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};