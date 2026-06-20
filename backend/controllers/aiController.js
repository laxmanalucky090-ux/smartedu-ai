import axios from "axios";
const API_KEY = process.env.GROQ_API_KEY;

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
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content;
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: err.message });
  }
};