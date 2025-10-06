import Challenge from "../models/Challenge.js";

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
