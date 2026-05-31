# FutureMe — Transmissions From Your Future Self

FutureMe is a premium, AI-powered personal reflection web application. Users input details about their current life status, core ambitions, struggles, and one-year vision. Using the Gemini API, the app generates a powerful, customized, emotionally intelligent message from their future self (one year from now). It also produces tactical next steps, a daily habit, mistakes to avoid, and a daily mantra. After viewing the dashboard, users can chat continuously with their future self in a premium, real-time messaging interface.



---

## Features

- **Personal Reflection Envelope**: A clean, multi-step inspired form to submit goals and challenges.
- **Dynamic Tone Selection**: Choose how your future self speaks to you:
  - *Motivational*: Warm, inspiring, and supportive.
  - *Brutally Honest*: Direct, sharp, and high-accountability.
  - *Calm Mentor*: Grounded, peaceful, and perspective-driven.
  - *CEO Mode*: Tactical, focused, and execution-heavy.
- **Glassmorphic Dashboard**: A stunning Apple-style dashboard showcasing the future self's transmission, future identity, actions, warning, and daily mantra.
- **Interactive Temporal Chat**: Continually follow up and chat with your future identity.
- **One-Click Share/Copy**: Easily copy your full generated profile formatted for sharing or journaling.

---

## Project Structure

```text
FutureMe AI/
├── backend/
│   ├── server.js          # Node.js + Express API server with Gemini Integration
│   ├── package.json       # Backend dependencies (dotenv, cors, @google/generative-ai)
│   ├── .env.example       # Environment template
│   └── .env               # Active configuration (ignored by git)
├── frontend/
│   ├── index.html         # Main dashboard layout
│   ├── style.css          # Premium cosmic glassmorphic stylesheets
│   └── script.js          # Frontend state, transitions, and fetch integration
└── README.md              # Documentation
```

---

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v16.0.0 or higher is recommended).

### 2. Set Up the Backend & API Key
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Open the `.env` file in the `backend` directory.
3. Replace the placeholder value with your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=5000
   ```
   *(If you don't have an API key, you can obtain one from the [Google AI Studio](https://aistudio.google.com/)).*

### 3. Install Dependencies & Run the Server
While inside the `backend` folder, run:
```bash
npm install
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000). It will also serve the static frontend files directly.

### 4. Access the App
You can open the application in two ways:
1. **Via the backend server (Recommended)**: Open your browser and go to [http://localhost:5000](http://localhost:5000).
2. **Direct Static Load**: Double-click `frontend/index.html` or run any static HTTP server inside the `frontend` folder (the API requests will automatically route to localhost:5000).

---

## API Documentation

### 1. Generate Reflection Card
- **Endpoint**: `POST /api/generate-futureme`
- **Request Body**:
  ```json
  {
    "name": "Nitish",
    "age": "23",
    "goal": "Build a successful AI startup",
    "struggle": "Lack of consistency",
    "oneYearVision": "Running a profitable AI company",
    "tone": "Brutally Honest"
  }
  ```
- **Response Format**:
  ```json
  {
    "success": true,
    "data": {
      "message": "...",
      "futureIdentity": "...",
      "nextMoves": ["Move 1", "Move 2", "Move 3"],
      "habit": "...",
      "warning": "...",
      "mantra": "..."
    }
  }
  ```

### 2. Follow-Up Chat
- **Endpoint**: `POST /api/chat-futureme`
- **Request Body**:
  ```json
  {
    "userProfile": {
      "name": "Nitish",
      "age": "23",
      "goal": "Build a successful AI startup",
      "struggle": "Lack of consistency",
      "oneYearVision": "Running a profitable AI company",
      "tone": "Brutally Honest"
    },
    "chatHistory": [
      {
        "role": "user",
        "message": "Will I actually make it?"
      },
      {
        "role": "futureme",
        "message": "Only if your daily actions stop negotiating with your dreams."
      }
    ],
    "question": "What should I focus on this week?"
  }
  ```
- **Response Format**:
  ```json
  {
    "success": true,
    "reply": "..."
  }
  ```
