import express from "express";
import {
  reportScam,
  getLatestVerifiedScams,
  searchScams,
  getScamById,
} from "../controllers/scam.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/report", authMiddleware, reportScam);
router.get("/latest", getLatestVerifiedScams);
router.get("/search", searchScams);
router.get("/:id", getScamById);

export default router;