import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// HOME ROUTE (FIX for Cannot GET /)
app.get("/", (req, res) => {
  res.send("SmartEdu AI Backend Running ✅");
});

// CHAT ROUTE
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are SmartEdu AI Mentor 🎓
Help students in simple way.

Question:
${message}
    `;

    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({ reply });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ reply: "AI server error" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});