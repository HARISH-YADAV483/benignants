import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: Always create req.user with id + role
    req.user = {
      id: decoded.id || decoded._id, // ✅ handles both cases
      role: decoded.role || "user",
      email: decoded.email || "",
    };

    if (!req.user.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    next();
  } catch (error) {
    console.log("❌ authMiddleware error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;