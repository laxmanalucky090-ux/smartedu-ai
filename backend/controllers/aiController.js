import axios from "axios";

const API_KEY = process.env.GEMINI_API_KEY;

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are SmartEdu AI Mentor.

Answer this student question:
${message}

Give simple, clear explanation for exam preparation.
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};