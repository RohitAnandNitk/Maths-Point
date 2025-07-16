const Attempt = require("../Models/attempt");
const Test = require("../Models/test");
const Question = require("../Models/question");

const mongoose = require("mongoose");

// Save an attempt
exports.saveAttempt = async (req, res) => {
  console.log("Call for the save attempt");
  try {
    const userId = req.user._id; // Assuming you’re using auth middleware and setting req.user
    console.log("User Id : ", userId);
    const { test_id, answers } = req.body;

    console.log(answers);

    if (!test_id || !answers || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ message: "test_id and answers are required." });
    }

    const test = await Test.findById(test_id);
    if (!test) {
      return res.status(404).json({ message: "Test not found." });
    }

    let score = 0;
    const evaluatedAnswers = [];

    // Evaluate each answer
    for (const ans of answers) {
      const question = await Question.findById(ans.question_id);
      if (!question) continue;

      const isCorrect = question.correct_option === ans.selected_option;
      if (isCorrect) score++;

      evaluatedAnswers.push({
        question_id: question._id,
        selected_option: ans.selected_option,
        is_correct: isCorrect,
      });
    }

    const attempt = new Attempt({
      user_id: userId,
      test_id: test_id,
      answers: evaluatedAnswers,
      score,
      completed_at: new Date(),
    });

    await attempt.save();

    res.status(201).json({
      message: "Attempt saved successfully.",
      attempt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

exports.getMyAttempts = async (req, res) => {
  console.log("Call for get all attempts");
  try {
    const userId = req.user._id;

    const attempts = await Attempt.find({ user_id: userId })
      .populate("test_id", "name subject")
      .populate("answers.question_id", "text correct_option")
      .sort({ createdAt: -1 });

    res.status(200).json({ attempts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// Optional: get single attempt by ID
exports.getAttemptById = async (req, res) => {
  try {
    const attemptId = req.params.id;

    const attempt = await Attempt.findById(attemptId)
      .populate("test_id", "title subject")
      .populate("answers.question_id", "text");

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found." });
    }

    res.status(200).json({ attempt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};
