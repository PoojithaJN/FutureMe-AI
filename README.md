# FutureMe AI — Transmissions From Your Future Self

FutureMe AI is a premium AI-powered personal reflection web application. Users enter details about their current goals, struggles, one-year vision, available daily time, and preferred communication tone. Using the Gemini API, the app generates a personalized message from the user’s future self.

The app provides a future-self letter, future identity, tactical next steps, a realistic daily plan, one daily habit, a warning to avoid mistakes, and a daily mantra. Users can also continue chatting with their future self through an interactive messaging interface.

---

## Features

- **Personal Reflection Form**  
  Users can enter their name, age, goal, current struggle, one-year vision, and daily available time.

- **Dynamic Tone Selection**  
  Users can choose how their future self responds:
  - **Motivational**: Warm, inspiring, and supportive.
  - **Brutally Honest**: Direct, sharp, and high-accountability.
  - **Calm Mentor**: Grounded, peaceful, and perspective-driven.
  - **CEO Mode**: Tactical, focused, and execution-heavy.

- **AI-Generated Future Self Message**  
  Generates a personalized and emotionally intelligent message from the user’s future self.

- **Realistic Daily Plan**  
  Creates a practical daily plan based on the user’s available time, including task duration, purpose, and motivation.

- **Tactical Next Moves**  
  Provides 3 clear action steps to help the user move closer to their goal.

- **Daily Habit, Warning, and Mantra**  
  Helps users stay consistent, avoid common mistakes, and stay motivated.

- **Glassmorphic Dashboard**  
  Displays the generated FutureMe transmission in a premium, modern interface.

- **Interactive FutureMe Chat**  
  Allows users to ask follow-up questions and receive guidance from their future self.

- **One-Click Copy**  
  Users can copy the full generated FutureMe transmission for journaling, planning, or sharing.

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- Gemini API
- dotenv
- cors

---

## Project Structure

```text
FutureMe AI/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
└── README.md
```

> Note: `backend/.env` is required locally but should not be pushed to GitHub.

---

## Getting Started

### 1. Prerequisites

Make sure Node.js is installed on your system.

Download Node.js from:  
https://nodejs.org/

---

### 2. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/futureme-ai.git
cd futureme-ai
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

### 3. Set Up Environment Variables

Go to the backend folder:

```bash
cd backend
```

Create a file named:

```text
.env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```

You can create a Gemini API key from Google AI Studio:  
https://aistudio.google.com/app/apikey

---

### 4. Install Dependencies

Inside the `backend` folder, run:

```bash
npm install
```

---

### 5. Run the Project

```bash
npm run dev
```

The server will start at:

```text
http://localhost:5000
```

Open this URL in your browser to use the application.

---

## API Documentation

### 1. Generate FutureMe Reflection

**Endpoint**

```http
POST /api/generate-futureme
```

**Request Body**

```json
{
  "name": "Poojitha",
  "age": "21",
  "goal": "Become a Java Backend Developer",
  "struggle": "I struggle with consistency and building complete projects",
  "oneYearVision": "Get placed in a good software company with strong backend skills",
  "availableTime": "2 hours daily",
  "tone": "Motivational"
}
```

**Response Format**

```json
{
  "success": true,
  "data": {
    "message": "A personalized message from the user's future self.",
    "futureIdentity": "A concise description of who the user is becoming.",
    "nextMoves": [
      "Action 1",
      "Action 2",
      "Action 3"
    ],
    "habit": "One small daily habit.",
    "dailyPlan": [
      {
        "time": "30 min",
        "task": "Revise one backend concept",
        "purpose": "Build strong technical fundamentals",
        "motivation": "Small daily progress creates real confidence."
      }
    ],
    "warning": "One mistake the user should avoid.",
    "mantra": "A short daily reminder."
  }
}
```

---

### 2. Chat With FutureMe

**Endpoint**

```http
POST /api/chat-futureme
```

**Request Body**

```json
{
  "userProfile": {
    "name": "Poojitha",
    "age": "21",
    "goal": "Become a Java Backend Developer",
    "struggle": "I struggle with consistency and building complete projects",
    "oneYearVision": "Get placed in a good software company with strong backend skills",
    "availableTime": "2 hours daily",
    "tone": "Motivational"
  },
  "chatHistory": [
    {
      "role": "user",
      "message": "How should I stay consistent?"
    },
    {
      "role": "futureme",
      "message": "Start with small daily actions instead of waiting for perfect motivation."
    }
  ],
  "question": "What should I focus on this week?"
}
```

**Response Format**

```json
{
  "success": true,
  "reply": "Personalized reply from FutureMe."
}
```

---

## Security Note

Do not upload your `.env` file to GitHub because it contains your Gemini API key.

Your `.gitignore` should include:

```gitignore
.env
backend/.env
node_modules/
backend/node_modules/
dist/
build/
.DS_Store
Thumbs.db
```

---

## Future Improvements

- Add user login and saved history
- Add downloadable PDF reports
- Add calendar-based planning
- Add progress tracking dashboard
- Add reminders and streak tracking
- Add deployment support

---

## Author

Developed as a personal AI productivity and reflection project.
