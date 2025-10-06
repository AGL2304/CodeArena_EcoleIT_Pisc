import express from "express";
import { createSubmission, getSubmissionsByUser, getSubmissionsByChallenge } from "../controllers/submissionController.js";

const router = express.Router();

// Soumettre un code pour un challenge
router.post("/", createSubmission);

// Récupérer toutes les submissions d'un utilisateur
router.get("/user/:userId", getSubmissionsByUser);

// Récupérer toutes les submissions pour un challenge
router.get("/challenge/:challengeId", getSubmissionsByChallenge);

export default router;
