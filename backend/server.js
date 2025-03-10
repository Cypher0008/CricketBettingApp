const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
