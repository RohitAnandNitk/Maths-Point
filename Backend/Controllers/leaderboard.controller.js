const Attempt = require("../Models/attempt");
const User = require("../Models/user");
const mongoose = require("mongoose");

exports.getLeaderboard = async (req, res) => {
  console.log("Call received at backend for leaderboard data");
  const { examId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(examId)) {
    return res.status(400).json({ error: "Invalid exam ID" });
  }

  try {
    const attempts = await Attempt.find({ test_id: examId })
      .populate("user_id", "fullname")
      .lean();

    if (!attempts.length) {
      return res.json({ leaderboard: [] });
    }

    // sort by highest score, then lowest duration
    attempts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        (a.duration_seconds || Infinity) - (b.duration_seconds || Infinity)
      );
    });

    const leaderboard = attempts.map((attempt, index) => {
      const duration = attempt.duration_seconds;

      return {
        userId: attempt.user_id._id,
        name: attempt.user_id.fullname,
        score: attempt.score,
        timeTaken: duration ? (duration / 60).toFixed(2) : "N/A",
        rank: index + 1,
      };
    });

    console.log(leaderboard);
    res.json({ leaderboard });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
