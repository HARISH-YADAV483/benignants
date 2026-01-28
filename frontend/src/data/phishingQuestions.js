export const phishingQuestions = [
  {
    id: 1,
    level: "beginner",
    type: "email",
    message:
      "Your bank account will be blocked today. Click the link to verify your KYC: http://bit.ly/kyc-update",
    correctAnswer: "phishing",
    explanation:
      "Real banks never ask you to click random links for KYC updates. Short links are suspicious.",
  },
  {
    id: 2,
    level: "beginner",
    type: "sms",
    message:
      "Congratulations! You won ₹50,000 cashback. Claim now by entering your OTP.",
    correctAnswer: "phishing",
    explanation:
      "Scammers use rewards + OTP to steal accounts. Never share OTP with anyone.",
  },
  {
    id: 3,
    level: "intermediate",
    type: "email",
    message:
      "Hi, please review the attached invoice urgently. Regards, Accounts Team.",
    correctAnswer: "phishing",
    explanation:
      "Unexpected invoices and urgency are common phishing tricks. Verify sender before opening attachments.",
  },
  {
    id: 4,
    level: "advanced",
    type: "website",
    message:
      "Your session expired. Login again to continue: www.paytm-secure-login.com",
    correctAnswer: "phishing",
    explanation:
      "The domain is fake. Legit Paytm domain would not contain random words like secure-login.",
  },
  {
    id: 5,
    level: "advanced",
    type: "email",
    message:
      "Google Security Alert: New sign-in from Chrome on Windows. If this was you, ignore this email.",
    correctAnswer: "safe",
    explanation:
      "This looks like a typical security alert. Still, always verify sender domain before clicking anything.",
  },
];