import ScamReport from "../models/ScamReport.model.js";
import { calculateScamScore, getRiskLevel } from "../utils/scamScore.js";

import VerifiedScamContact from "../models/VerifiedScamContact.model.js";
import { detectContactType, normalizeContact } from "../utils/contactMatch.js";
import { simpleSimilarity } from "../utils/similarity.js";

// ✅ 1) REPORT A SCAM
// POST /api/scams/report
export const reportScam = async (req, res) => {
  try {
    const {
      title,
      description,
      scamType,
      platform,
      scammerContact,
      lossAmount,
    } = req.body;

    // ✅ Validation
    if (!title || !description || !scamType || !platform) {
      return res.status(400).json({ message: "❌ Required fields missing" });
    }

    // ✅ Base score
    let susceptibilityScore = calculateScamScore(`${title} ${description}`);

    // ✅ Add +35 if money loss happened
    const loss = Number(lossAmount || 0);
    if (loss > 0) susceptibilityScore += 35;

    // ✅ STEP 4: Match scammer contact with verified scam contacts DB
    let contactMatchPercent = 0;
    let matchedVerifiedContacts = [];

    if (scammerContact && scammerContact.trim() !== "") {
      const inputType = detectContactType(scammerContact);
      const normInput = normalizeContact(scammerContact);

      // ✅ Fetch verified contacts of same type
      const dbContacts = await VerifiedScamContact.find({
        type: inputType,
        isVerified: true,
      }).limit(200);

      for (const c of dbContacts) {
        const normDb = normalizeContact(c.value);
        const sim = simpleSimilarity(normInput, normDb);

        // ✅ best match percent
        if (sim > contactMatchPercent) {
          contactMatchPercent = sim;
        }

        // ✅ store verified references if similarity >= 70%
        if (sim >= 70) {
          matchedVerifiedContacts.push({
            value: c.value,
            type: c.type,
            source: c.source,
            similarity: sim,
            tags: c.tags,
            notes: c.notes,
          });
        }
      }

      // ✅ Add points based on match percent
      // You can change scoring as you like
      if (contactMatchPercent >= 90) susceptibilityScore += 35;
      else if (contactMatchPercent >= 80) susceptibilityScore += 25;
      else if (contactMatchPercent >= 70) susceptibilityScore += 15;
    }

    // ✅ Cap score to 100
    if (susceptibilityScore > 100) susceptibilityScore = 100;

    // ✅ Risk level
    const riskLevel = getRiskLevel(susceptibilityScore);

    // ✅ Save to DB
    const report = await ScamReport.create({
      title,
      description,
      scamType,
      platform,
      scammerContact: scammerContact || "",
      lossAmount: loss,
      susceptibilityScore,
      status: "pending",
      reportedBy: req.user.id,

      // ✅ NEW fields
      contactMatchPercent,
      matchedVerifiedContacts,
    });

    res.status(201).json({
      message: "✅ Scam reported successfully",
      report,
      riskLevel,

      // ✅ Return these to frontend for showing reference
      contactMatchPercent,
      matchedVerifiedContacts,
    });
  } catch (error) {
    console.log("❌ reportScam error:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// ✅ 2) GET LATEST VERIFIED SCAMS
// GET /api/scams/latest
export const getLatestVerifiedScams = async (req, res) => {
  try {
    const scams = await ScamReport.find({ status: "verified" })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(scams);
  } catch (error) {
    console.log("❌ getLatestVerifiedScams error:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// ✅ 3) SEARCH VERIFIED SCAMS
// GET /api/scams/search?q=otp
export const searchScams = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "❌ Search query is required" });
    }

    const scams = await ScamReport.find({
      status: "verified",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { scammerContact: { $regex: q, $options: "i" } },
        { scamType: { $regex: q, $options: "i" } },
        { platform: { $regex: q, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(scams);
  } catch (error) {
    console.log("❌ searchScams error:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// ✅ 4) GET SCAM BY ID
// GET /api/scams/:id
export const getScamById = async (req, res) => {
  try {
    const { id } = req.params;

    const scam = await ScamReport.findById(id);

    if (!scam) {
      return res.status(404).json({ message: "❌ Scam not found" });
    }

    res.status(200).json(scam);
  } catch (error) {
    console.log("❌ getScamById error:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};