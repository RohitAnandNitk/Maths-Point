const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    test_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    answers: [
      {
        question_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selected_option: { type: String, required: true },
        is_correct: { type: Boolean, required: true },
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    duration_seconds: {
      type: Number,
    },
    completed_at: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "incomplete", "cheated"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attempt", attemptSchema);
