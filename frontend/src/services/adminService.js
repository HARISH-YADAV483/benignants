import api from "./api";

export const getPendingReports = () => api.get("/admin/pending");
export const verifyReport = (id) => api.put(`/admin/verify/${id}`);
export const rejectReport = (id) => api.put(`/admin/reject/${id}`);