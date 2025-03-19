const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const matchRoutes = require("./routes/matchRoutes");
const betRoutes = require("./routes/betRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const debugRoutes = require("./routes/debugRoutes");
const { initOddsCronJob } = require("./services/cronService");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize cron job for odds fetching
initOddsCronJob();

// ✅ API Routes
app.use("/api", matchRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/debug", debugRoutes);

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
