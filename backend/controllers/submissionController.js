import Submission from "../models/Submission.js";
import Challenge from "../models/Challenge.js";
import { runCode } from "../utils/codeExecutor.js"; // fonction adaptée pour exécuter le code

// Helper pour transformer la fonction callback en Promise
const runCodeAsync = (language, code) => {
  return new Promise((resolve, reject) => {
    runCode(language, code, (err, output) => {
      if (err) return reject(err);
      resolve(output);
    });
  });
};

// Créer une submission et exécuter le code
export const createSubmission = async (req, res) => {
  try {
    const { userId, challengeId, code, language, languageVersion } = req.body;

    if (!userId || !challengeId || !code) {
      return res.status(400).json({ message: "userId, challengeId et code sont requis" });
    }

    // Récupérer le challenge pour ses test cases
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge non trouvé" });
    }

    // Exécuter le code dans le sandbox
    let output = "";
    let error = null;
    let startTime = Date.now();

    try {
      output = await runCodeAsync(language || "javascript", code);
    } catch (err) {
      error = err.toString();
    }

    const timeTaken = Date.now() - startTime;

    // Comparer la sortie avec les test cases pour calculer un score
    let score = 0;
    if (!error && output.trim() === challenge.testCases.expectedOutput.trim()) {
      score = 100;
    }

    const submission = new Submission({
      user: userId,
      challenge: challengeId,
      code,
      language: language || "javascript",
      languageVersion,
      output,
      expectedOutput: challenge.testCases.expectedOutput,
      error,
      timeTaken,
      score,
      status: error ? "Failed" : "Success",
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
