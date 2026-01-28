import { scamKeywords } from "./scamKeywords";

export const analyzeTextForScam = (text) => {
  const lower = text.toLowerCase();

  let score = 0;
  let matched = [];

  // ✅ keyword scoring
  scamKeywords.forEach((k) => {
    if (lower.includes(k.word)) {
      score += k.score;
      matched.push(k.word);
    }
  });

  // ✅ link detection
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const urls = lower.match(urlRegex) || [];
  if (urls.length > 0) score += 15;

  // ✅ phone number detection
  const phoneRegex = /(\+?\d{10,13})/g;
  const phones = lower.match(phoneRegex) || [];
  if (phones.length > 0) score += 10;

  // ✅ cap
  if (score > 100) score = 100;

  // ✅ risk label
  let risk = "LOW";
  if (score >= 70) risk = "HIGH";
  else if (score >= 40) risk = "MEDIUM";

  return {
    score,
    risk,
    matchedKeywords: matched,
    detectedUrls: urls,
    detectedPhones: phones,
  };
};