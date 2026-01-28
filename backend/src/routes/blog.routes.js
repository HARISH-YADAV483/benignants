import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createBlog,
  getVerifiedBlogs,
  getBlogById,
  getMyBlogs,
  getPendingBlogs,
  verifyBlog,
  rejectBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

/* ✅ PUBLIC BLOGS */
router.get("/", getVerifiedBlogs);

/* ✅ USER BLOGS (must be BEFORE /:id) */
router.get("/my/list", authMiddleware, getMyBlogs);

/* ✅ ADMIN BLOGS */
router.get("/admin/pending", authMiddleware, getPendingBlogs);
router.put("/admin/verify/:id", authMiddleware, verifyBlog);
router.put("/admin/reject/:id", authMiddleware, rejectBlog);

/* ✅ CREATE BLOG */
router.post("/", authMiddleware, createBlog);

/* ✅ SINGLE BLOG (must be LAST) */
router.get("/:id", getBlogById);

export default router;