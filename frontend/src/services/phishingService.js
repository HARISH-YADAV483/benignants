import api from "./api";

export const getQuestions = (level) => api.get(`/phishing/questions/${level}`);

export const submitAnswer = (data) => api.post("/phishing/submit", data);
export const saveProgress = (data) => api.post("/phishing/save-progress", data);