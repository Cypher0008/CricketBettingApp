const express = require("express");
const Bet = require("../models/Bet");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// ✅ Get User Bets (Authenticated User)
router.get("/:username", protect, async (req, res) => {
  try {
    if (req.user.username !== req.params.username) {
      return res.status(403).json({ error: "Unauthorized to access these bets" });
    }

    const bets = await Bet.find({ username: req.params.username });
    res.json(bets);
  } catch (error) {
    console.error("❌ [BET ERROR]:", error);
    res.status(500).json({ error: "Failed to retrieve bets" });
  }
});

// ✅ Place a Bet (Authenticated User Only)
router.post("/place", protect, async (req, res) => {
  const { matchId, team, amount } = req.body;

  try {
    // ✅ Directly access the user from token (no need to fetch again)
    const user = req.user;

    console.log(`✅ [BET REQUEST]: ${user.username} is trying to place a bet`);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    console.log(`✅ [USER CREDITS]: Current credits: ${user.credits}, Bet Amount: ${amount}`);

    // ✅ Check user credits
    if (user.credits < amount) {
      return res.status(400).json({ error: "Insufficient credits" });
    }

    // ✅ Deduct credits and save
    user.credits -= amount;
    await user.save();

    console.log(`✅ [UPDATED CREDITS]: ${user.username} now has ${user.credits} credits`);

    // ✅ Save the bet
    const bet = new Bet({
      username: user.username,
      matchId,
      team,
      amount,
      status: "Pending",
    });
    await bet.save();

    console.log(`✅ [BET PLACED]: Bet ID - ${bet._id}`);

    res.json({ message: "Bet placed successfully", bet });
  } catch (error) {
    console.error("❌ [BET ERROR]:", error);
    res.status(500).json({ error: "Failed to place bet" });
  }
});

// ✅ Get All Bets (Admin Only)
router.get("/all", protect, admin, async (req, res) => {
  try {
    const bets = await Bet.find();
    res.json(bets);
  } catch (error) {
    console.error("❌ [BET ERROR]:", error);
    res.status(500).json({ error: "Failed to fetch all bets" });
  }
});

// ✅ Admin Cancels a Bet
router.delete("/:betId", protect, admin, async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.betId);
    if (!bet) return res.status(404).json({ error: "Bet not found" });

    // ✅ Refund user if the bet is canceled
    const user = await User.findOne({ username: bet.username });
    user.credits += bet.amount;
    await user.save();

    await bet.deleteOne();

    res.json({ message: "Bet canceled and refunded", betId: req.params.betId });
  } catch (error) {
    console.error("❌ [BET ERROR]:", error);
    res.status(500).json({ error: "Failed to cancel bet" });
  }
});

// ✅ Update Bet Status (Admin Only)
router.put("/update/:betId", protect, admin, async (req, res) => {
  const { status } = req.body;

  try {
    const bet = await Bet.findById(req.params.betId);
    if (!bet) return res.status(404).json({ error: "Bet not found" });

    bet.status = status;
    await bet.save();

    res.json({ message: "Bet status updated successfully", bet });
  } catch (error) {
    console.error("❌ [BET ERROR]:", error);
    res.status(500).json({ error: "Failed to update bet status" });
  }
});

module.exports = router;
