import Blog from "../models/Blog.model.js";

// ✅ 1) USER: CREATE BLOG (Pending verification)
// POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const { title, subtitle, body, images } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const blog = await Blog.create({
      title,
      subtitle: subtitle || "",
      body,
      images: images || [],
      author: req.user.id,
      status: "pending",
    });

    return res.status(201).json({
      message: "✅ Blog submitted for verification",
      blog,
    });
  } catch (err) {
    console.log("❌ createBlog error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ 2) PUBLIC: GET ALL VERIFIED BLOGS
// GET /api/blogs
export const getVerifiedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "verified" })
      .populate("author", "name profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json(blogs);
  } catch (err) {
    console.log("❌ getVerifiedBlogs error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ 3) PUBLIC: GET SINGLE VERIFIED BLOG BY ID
// GET /api/blogs/:id
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate("author", "name profilePic");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.status !== "verified") {
      return res.status(403).json({ message: "Blog not verified yet" });
    }

    return res.status(200).json(blog);
  } catch (err) {
    console.log("❌ getBlogById error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ 4) ADMIN: GET ALL PENDING BLOGS
// GET /api/blogs/admin/pending
export const getPendingBlogs = async (req, res) => {
  try {
    // ✅ Admin check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const blogs = await Blog.find({ status: "pending" })
      .populate("author", "name profilePic email")
      .sort({ createdAt: -1 });

    return res.status(200).json(blogs);
  } catch (err) {
    console.log("❌ getPendingBlogs error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ 5) ADMIN: VERIFY BLOG
// PUT /api/blogs/admin/verify/:id
export const verifyBlog = async (req, res) => {
  try {
    // ✅ Admin check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.status = "verified";
    blog.adminNote = "";
    await blog.save();

    return res.status(200).json({
      message: "✅ Blog verified successfully",
      blog,
    });
  } catch (err) {
    console.log("❌ verifyBlog error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ 6) ADMIN: REJECT BLOG
// PUT /api/blogs/admin/reject/:id
export const rejectBlog = async (req, res) => {
  try {
    // ✅ Admin check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { id } = req.params;
    const { adminNote } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.status = "rejected";
    blog.adminNote = adminNote || "Rejected by admin";
    await blog.save();

    return res.status(200).json({
      message: "❌ Blog rejected",
      blog,
    });
  } catch (err) {
    console.log("❌ rejectBlog error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ USER: GET MY BLOGS (pending + verified + rejected)
// GET /api/blogs/my
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json(blogs);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};