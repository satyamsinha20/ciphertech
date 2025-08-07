require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Client = require("./models/Client");
const authRoutes = require("./routes/auth");


const app = express();
const cors = require('cors');

app.use(cors({
  origin: "https://ciphertech-frontend.vercel.app", // update after Vercel is deployed
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);


// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));




// Submit API
app.post("/api/submit", async (req, res) => {
  try {
    const { name, email, phone, serviceType, requirement } = req.body;
    const newClient = new Client({
      name,
      email,
      phone,
      serviceType,
      requirement,
    });
    await newClient.save();
    res.status(200).json({ message: "Submission successful" });
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
