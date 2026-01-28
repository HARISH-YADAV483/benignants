import PhishingQuestion from "../models/PhishingQuestion.model.js";
import User from "../models/User.model.js";

const POINTS = {
  beginner: 1,
  medium: 3,
  pro: 6,
};

const PASS_PERCENT = 0.1;

const isLevelUnlocked = (user, level) => {
  if (level === "beginner") return true;
  if (level === "medium") return user.phishingProgress.beginner.completed;
  if (level === "pro") return user.phishingProgress.medium.completed;
  return false;
};

// ✅ Get questions for a level
// GET /api/phishing/questions/:level
export const getQuestionsByLevel = async (req, res) => {
  try {
    const { level } = req.params;

    const validLevels = ["beginner", "medium", "pro"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: "Invalid level" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!isLevelUnlocked(user, level)) {
      return res.status(403).json({ message: "Level locked" });
    }

    const limit = level === "beginner" ? 100 : 50;

    const questions = await PhishingQuestion.find({ level }).limit(limit);

    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Submit answer + update progress
// POST /api/phishing/submit
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, selectedAnswer, currentIndex } = req.body;

    if (!questionId || selectedAnswer === undefined) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const question = await PhishingQuestion.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const level = question.level;

    if (!isLevelUnlocked(user, level)) {
      return res.status(403).json({ message: "Level locked" });
    }

    const isCorrect = question.correctAnswer === selectedAnswer;

    // ✅ Ensure attemptMap exists
    if (!user.phishingProgress[level].attemptMap) {
      user.phishingProgress[level].attemptMap = {};
    }

    // ✅ Check previous status (before updating)
    const prevStatus =
      user.phishingProgress[level].attemptMap[String(questionId)] || "unattempted";

    // ✅ Award points ONLY when:
    // 1) Fresh question answered correct
    // 2) Previously wrong but now correct
    // ❌ If already correct -> no extra points
    if (isCorrect && prevStatus !== "correct") {
      user.phishingProgress[level].correct += 1;
      user.points += POINTS[level];
    }

    // ✅ Update attemptMap with latest result
    user.phishingProgress[level].attemptMap[String(questionId)] = isCorrect
      ? "correct"
      : "wrong";

    // ✅ Force mongoose to save nested object changes
    user.markModified(`phishingProgress.${level}.attemptMap`);

    // ✅ Save resume index (if provided)
    if (currentIndex !== undefined) {
      user.phishingProgress[level].currentIndex = currentIndex;
    }

    // ✅ Completion unlock logic
    const correct = user.phishingProgress[level].correct;
const total = user.phishingProgress[level].total;

const unlockCount = Math.ceil(total * 0.6); // ✅ 10%

if (correct >= unlockCount) {
  user.phishingProgress[level].completed = true;

  if (level === "beginner") user.phishingProgress.medium.unlocked = true;
  if (level === "medium") user.phishingProgress.pro.unlocked = true;
}

    await user.save();

    return res.status(200).json({
      message: "✅ Answer submitted",
      level,
      isCorrect,
      explanation: question.explanation,
      progress: user.phishingProgress,
      points: user.points,

      // ✅ return attemptMap so frontend syncs navigator instantly
      attemptMap: user.phishingProgress[level].attemptMap,
      currentIndex: user.phishingProgress[level].currentIndex,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Save progress index only
// POST /api/phishing/save-progress
export const saveProgress = async (req, res) => {
  try {
    const { level, currentIndex } = req.body;

    const validLevels = ["beginner", "medium", "pro"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: "Invalid level" });
    }

    if (currentIndex === undefined) {
      return res.status(400).json({ message: "Missing level or index" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.phishingProgress[level].currentIndex = currentIndex;

    await user.save();

    return res.status(200).json({
      message: "✅ Progress saved",
      level,
      currentIndex,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};