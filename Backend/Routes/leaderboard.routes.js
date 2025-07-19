const express = require("express");
const router = express.Router();
const leaderboardController = require("../Controllers/leaderboard.controller");

router.get("/:examId", leaderboardController.getLeaderboard);

module.exports = router;
