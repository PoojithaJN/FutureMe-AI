const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');

// --- CONFIGURATION ---
const GEMINI_MODEL = 'gemini-2.5-flash';

// --- ROBUST .ENV LOADER ---
const localEnvPath = path.join(__dirname, '.env');
const parentEnvPath = path.join(__dirname, '../.env');

if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else if (fs.existsSync(parentEnvPath)) {
  dotenv.config({ path: parentEnvPath });
} else {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to clean markdown-wrapped JSON if needed
function cleanAndParseJSON(text) {
  let cleanText = text.trim();

  cleanText = cleanText.replace(/^```json\s*/i, '');
  cleanText = cleanText.replace(/^```\s*/, '');
  cleanText = cleanText.replace(/```\s*$/, '');
  cleanText = cleanText.trim();

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Failed to parse JSON directly. Raw text:', text);

    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const fallbackText = cleanText.substring(firstBrace, lastBrace + 1);
      return JSON.parse(fallbackText);
    }

    throw error;
  }
}

/**
 * 1. POST /api/generate-futureme
 * Generates initial future-self reflection package.
 */
app.post('/api/generate-futureme', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (
      !apiKey ||
      apiKey === 'replace_with_your_gemini_api_key' ||
      apiKey === 'your_api_key_here' ||
      apiKey.trim() === ''
    ) {
      return res.status(400).json({
        success: false,
        error: 'Gemini API key is not configured. Please edit your backend/.env file and set GEMINI_API_KEY to a valid Google AI Studio key.'
      });
    }

    const {
      name,
      age,
      goal,
      struggle,
      oneYearVision,
      availableTime,
      tone
    } = req.body;

    // Simple validation
    if (!name || !age || !goal || !struggle || !oneYearVision || !availableTime || !tone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required reflection details. Please fill in all fields.'
      });
    }

    // Initialize Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelJson = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `You are FutureMe, the future successful version of the user. You are not a generic motivational coach. You speak with emotional intelligence, clarity, and deep personal understanding. Your job is to help the user see who they are becoming, what they must change, and what they should do next.

Write as if you are the user’s future self speaking directly to their current self.

Tone selected by user: ${tone}

Make sure your tone aligns perfectly with this style:
- Motivational: warm, inspiring, supportive, encouraging. Focus on progress and self-belief.
- Brutally Honest: direct, sharp, no excuses, calls out unproductive behaviors. Focus on accountability.
- Calm Mentor: peaceful, wise, grounded, patient, perspective-driven. Focus on balance.
- CEO Mode: strategic, focused, execution-heavy, outcome-driven. Focus on discipline.

User details:
Name: ${name}
Age: ${age}
Goal: ${goal}
Current struggle: ${struggle}
One-year vision: ${oneYearVision}
Daily available time: ${availableTime}

Return only valid JSON in this exact format:
{
  "message": "A powerful 120-180 word message from the future self.",
  "futureIdentity": "A concise description of who the user is becoming.",
  "nextMoves": ["Action 1", "Action 2", "Action 3"],
  "habit": "One small daily habit they should start today.",
  "dailyPlan": [
    {
      "time": "20 min",
      "task": "A realistic task the user can complete today",
      "purpose": "Why this task matters for their goal",
      "motivation": "A short motivational push that makes the user feel they can do it"
    },
    {
      "time": "10 min",
      "task": "Another simple task",
      "purpose": "Why this task matters",
      "motivation": "Short motivational sentence"
    }
  ],
  "warning": "One mistake their future self warns them about.",
  "mantra": "A short memorable line they can repeat daily."
}

Important rules for dailyPlan:
- Create 4 to 6 small tasks based on the user's daily available time.
- Keep the plan realistic and easy to follow.
- Do not overload the user.
- Break big goals into small time blocks.
- Include short breaks if needed.
- Each task must have a clear purpose and motivating push.
- Make it feel practical enough that the user can actually do it today.
- If available time is less than 1 hour, create a light plan.
- If available time is 2-3 hours, create a focused but balanced plan.
- If available time is more than 4 hours, still include breaks and avoid burnout.

Make the contents highly personalized and detailed based on their struggles and goals. Avoid generic motivational statements. Make it emotional but highly actionable and practical.`;

    const result = await modelJson.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const data = cleanAndParseJSON(text);

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error generating FutureMe profile:', error);

    return res.status(500).json({
      success: false,
      error: `FutureMe API call failed: ${error.message || 'Internal connection issue'}. Please try again.`
    });
  }
});

/**
 * 2. POST /api/chat-futureme
 * Continuous chat with the future self.
 */
app.post('/api/chat-futureme', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (
      !apiKey ||
      apiKey === 'replace_with_your_gemini_api_key' ||
      apiKey === 'your_api_key_here' ||
      apiKey.trim() === ''
    ) {
      return res.status(400).json({
        success: false,
        error: 'Gemini API key is not configured in backend/.env file.'
      });
    }

    const { userProfile, chatHistory, question } = req.body;

    if (!userProfile || !question) {
      return res.status(400).json({
        success: false,
        error: 'Missing profile details or message content.'
      });
    }

    const {
      name,
      age,
      goal,
      struggle,
      oneYearVision,
      availableTime,
      tone
    } = userProfile;

    // Format chat history for context
    let formattedHistory = '';

    if (chatHistory && chatHistory.length > 0) {
      formattedHistory = chatHistory.map(chat => {
        const roleName = chat.role === 'user' ? 'Current Self' : 'FutureMe (Future Self)';
        return `${roleName}: ${chat.message}`;
      }).join('\n');
    } else {
      formattedHistory = 'No previous messages. This is the start of the chat conversation.';
    }

    // Initialize Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelText = genAI.getGenerativeModel({
      model: GEMINI_MODEL
    });

    const prompt = `You are FutureMe, the future version of the user who already achieved their one-year vision. Reply directly to the user’s question. Be personal, sharp, honest, and useful. Do not sound like a normal AI assistant. Do not mention that you are Gemini or an AI model. Speak like the future self.

User profile:
Name: ${name}
Age: ${age}
Goal: ${goal}
Struggle: ${struggle}
One-year vision: ${oneYearVision}
Daily available time: ${availableTime || 'Not specified'}
Tone: ${tone}

Ensure your response aligns perfectly with this tone:
- Motivational: warm, inspiring, supportive, encouraging.
- Brutally Honest: direct, sharp, no excuses, high accountability.
- Calm Mentor: peaceful, wise, grounded, patient, perspective-driven.
- CEO Mode: strategic, focused, execution-heavy, outcome-driven.

Recent chat history:
${formattedHistory}

Current question from user:
"${question}"

Reply in 2-5 short paragraphs. Give at least one clear, concrete action. If the user asks about routine, planning, focus, discipline, or consistency, use their daily available time and give a realistic plan. Do not output JSON. Reply with plain text only.`;

    const result = await modelText.generateContent(prompt);
    const response = await result.response;
    const reply = response.text().trim();

    return res.status(200).json({
      success: true,
      reply
    });

  } catch (error) {
    console.error('Error replying to FutureMe chat:', error);

    return res.status(500).json({
      success: false,
      error: `FutureMe chat link failed: ${error.message || 'Internal connection issue'}. Please try again.`
    });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`FutureMe server is running on http://localhost:${PORT}`);
});