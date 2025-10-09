import express from "express";
import { 
  createSubmission, 
  getSubmissionsByUser, 
  getSubmissionsByChallenge,
  getSubmissionById,
  getChallengeLeaderboard
} from "../controllers/submissionController.js";

const router = express.Router();

// Soumettre un code pour un challenge
router.post("/", createSubmission);

// Récupérer toutes les submissions d'un utilisateur
router.get("/user/:userId", getSubmissionsByUser);

// Récupérer toutes les submissions pour un challenge
router.get("/challenge/:challengeId", getSubmissionsByChallenge);

// Récupérer le leaderboard d'un challenge
router.get("/challenge/:challengeId/leaderboard", getChallengeLeaderboard);

// Récupérer une submission spécifique (doit être APRÈS les routes spécifiques)
router.get("/:id", getSubmissionById);

export default router;