const API_BASE = "http://localhost:5000/api";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "hi", label: "हिंदी (Hindi)" },
];

// AI Mentor (Backend)
export async function mentorChat(question, context = {}, history = [], language = "en") {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: question,
      }),
    });

    const data = await res.json();
    return data.reply || "No response";
  } catch (err) {
    return `⚠️ Backend error: ${err.message}`;
  }
}

// Temporary Study Plan
export async function generateStudyPlan(config) {
  return `
# Smart Study Plan

## Day 1
- Study core concepts
- Revise important topics

## Day 2
- Practice questions
- Review weak topics

## Final Revision
- Solve mock tests
- Revise notes
`;
}

// Temporary Tasks
export async function generateTasks() {
  return [
    {
      id: "1",
      day: 1,
      subject: "General",
      text: "Revise basics",
      type: "study",
      completed: false,
    },
  ];
}

// Temporary Resources
export async function generateResources() {
  return {
    General: {
      youtube: [{ title: "Introduction Tutorial" }],
      notes: [{ title: "Quick Notes", description: "Important concepts" }],
      pdfs: [{ title: "Reference PDF", description: "Study material" }],
      practice: [{ title: "Practice Questions", description: "Solve MCQs" }],
    },
  };
}

// Temporary Quiz
export async function generateQuiz() {
  return [
    {
      question: "What is AI?",
      options: [
        "Artificial Intelligence",
        "Automatic Internet",
        "Advanced Input",
        "None",
      ],
      correctIndex: 0,
      explanation: "AI stands for Artificial Intelligence.",
    },
  ];
}