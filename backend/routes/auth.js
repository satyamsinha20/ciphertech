const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const MainAdmin = require("../models/MainAdmin");
const Client = require("../models/Client");

const router = express.Router();

// ------------------------
// Admin Login API
// ------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await MainAdmin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "5m" } // 5 minutes session
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------
// Auth Middleware
// ------------------------
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ------------------------
// GET All Clients (Protected)
// ------------------------
router.get("/clients", authMiddleware, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({ clients });
  } catch (err) {
    console.error("Fetch clients error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------
// Approve Client by ID (Protected)
// ------------------------
router.put("/clients/:id/approve", authMiddleware, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({ message: "Client approved", client });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
