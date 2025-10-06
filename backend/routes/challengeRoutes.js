import express from "express";
import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge
} from "../controllers/challengeController.js";

const router = express.Router();

router.post("/", createChallenge);           // Créer un challenge
router.get("/", getAllChallenges);          // Tous les challenges
router.get("/:id", getChallengeById);       // Challenge par ID
router.put("/:id", updateChallenge);        // Mettre à jour
router.delete("/:id", deleteChallenge);     // Supprimer

export default router;
