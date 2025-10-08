import express from "express";
import Leaderboard from "../models/leaderboardModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { timeFrame, page = 1, limit = 10 } = req.query;

    // Récupération et tri par score décroissant
    const leaderboard = await Leaderboard.find()
      .sort({ score: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Calcul de quelques statistiques
    const totalUsers = await Leaderboard.countDocuments();
    const totalSolutions = await Leaderboard.aggregate([
      { $group: { _id: null, total: { $sum: "$solvedCount" } } },
    ]);
    const averageScore = await Leaderboard.aggregate([
      { $group: { _id: null, avg: { $avg: "$score" } } },
    ]);

    res.status(200).json({
      users: leaderboard,
      stats: {
        activeUsers: totalUsers,
        totalSolutions: totalSolutions[0]?.total || 0,
        averageScore: Math.round(averageScore[0]?.avg || 0),
      },
    });
  } catch (error) {
    console.error("Erreur leaderboard:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
