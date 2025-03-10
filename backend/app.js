const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const matchRoutes = require("./routes/matchRoutes");
const betRoutes = require("./routes/betRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ API Routes
app.use("/api", matchRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
