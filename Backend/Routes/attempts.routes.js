const express = require("express");
const router = express.Router();
const attemptController = require("../Controllers/attempts.controller");
const auth = require("../middleware/authentication.js");

router.post("/save", auth, attemptController.saveAttempt);
router.get("/get-all-attempts", auth, attemptController.getMyAttempts);
router.get("/:id", auth, attemptController.getAttemptById);

module.exports = router;
