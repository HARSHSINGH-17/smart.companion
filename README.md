# Smart Companion — Bridging the Executive Function Gap

> **This app is for people who want to work — but can’t start.**

A neuro-inclusive AI companion designed to help users start tasks by reducing overwhelming goals into safe, immediate micro-actions. Built for the **Neurothon** hackathon.

---

## 🧠 The Problem
For many neurodivergent individuals (ADHD, Dyslexia, Autism), the primary hurdle isn't skill—it's **Executive Function**.
- **Task Paralysis**: "Clean the house" feels impossible.
- **Time Blindness**: Difficulty sensing the passage of time.
- **Decision Fatigue**: Burning out on small choices before starting the real work.
- **Visual Stress**: Cluttered UIs and dense text cause anxiety.

---

## 💡 The Solution
**Smart Companion** acts as an external executive function cortex. It doesn't manage your project; it just helps you **start**.

### Key Features
- **Micro-Wins**: Converts vague tasks (e.g., "Study") into 3 atomic, physical steps (e.g., "Open laptop", "Open document", "Type one word").
- **Neuro-Inclusive UI**:
  - **Calm Mode**: "Stone" color palette to reduce sensory load.
  - **High Contrast**: Accessible mode for visual clarity.
  - **Dyslexia Support**: Adjustable font sizes and families (Sans/Serif/Mono).
- **Time Anchor**: A visual, non-numeric progress bar to ground users in time without the anxiety of a countdown clock.
- **Panic Mode**: One-click access to a guided 4-4-4 breathing exercise with calming audio cues.
- **Decision Mode**: Reduces decision fatigue by outsourcing binary choices to AI, complete with initiation steps.
- **Voice & Audio**:
  - **Voice Input**: Speak tasks to bypass typing friction.
  - **Text-to-Speech**: Read steps aloud for auditory processors.
  - **Sensory Feedback**: Gentle chimes and tactile button responses.

> **Design Note:** We intentionally avoided gamification and metrics because they can increase pressure and avoidance in users with executive dysfunction.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- An OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HARSHSINGH-17/smart.companion.git
   cd smart.companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment (Optional)**
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=sk-your-api-key-here
   ```
   *Note: You can also enter your API key directly inside the app via the "Offline Mode" banner.*

4. **Run the app**
   ```bash
   npm run dev
   ```

---

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS (Vite)
- **AI**: OpenAI API (GPT-3.5 Turbo)
- **State**: React Context API + LocalStorage (Privacy-first, no database)
- **Audio**: Web Speech API (TTS) + Web Audio API (Chimes/Beeps)

---

## 🛡️ Privacy & Offline Mode
- **Zero Data Collection**: All preferences and API keys are stored locally in your browser's `localStorage`.
- **Offline Fallback**: If the AI is unreachable or the key is missing, the app uses a robust internal library of "Occupational Therapy" scripts to ensure it remains functional.
