const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Protect Route Middleware (General)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ error: "User not found" });
      }

      next(); // Allow the request to continue
    } catch (error) {
      console.error("❌ [AUTH ERROR]:", error);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
};

// ✅ Admin Route Middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Not authorized as admin" });
  }
};

// ✅ User Route Middleware
const user = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    return res.status(403).json({ error: "Not authorized as user" });
  }
};

// ✅ Token Generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { protect, admin, user, generateToken };
