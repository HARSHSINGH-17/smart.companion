# Smart Companion — Micro-Wins for Task Initiation

A neuro-inclusive AI companion designed to help users start tasks by reducing overwhelming goals into safe, immediate micro-actions.

---

## Problem Statement

Many neurodivergent users (especially individuals with ADHD or dyslexia) do not struggle with knowing *what* to do — they struggle with *starting*.

Large, vague tasks trigger executive dysfunction, leading to paralysis rather than action.

---

## Our Approach

This project focuses on **task initiation**, not productivity.

Instead of planning, tracking, or optimizing tasks, the system converts an overwhelming goal into a single, non-intimidating **micro-win** that can be done immediately, with explicit permission to stop at any time.

**The design assumes executive dysfunction, not lack of motivation.**

---

## MVP Scope (Frozen)

### Included
- Set Your Space (3 clicks, skippable)
- Mode A: Right Now
- AI-generated micro-steps (1–3 only)
- Single-step view (one action at a time)
- “That’s enough” exit at every step
- Calm, distraction-free UI

### Explicitly Excluded
- User accounts or login
- Progress tracking or streaks
- Analytics or dashboards
- Notifications
- Scheduling or planning features
- Multiple themes or advanced customization

Any feature not listed above does not exist in the MVP.

---

## User Flow

1. Launch the app  
2. (Optional) Set basic preferences  
3. Enter a vague or overwhelming task  
4. Receive one micro-action  
5. Complete it or exit immediately  

---

## Neuro-Inclusive Design Principles

- One task visible at a time  
- No scrolling or dense text  
- Dyslexia-friendly font support  
- Immediate feedback (under 5 seconds)  
- No motivational pressure  
- Permission to stop at every step  

---

## AI Behavior

The AI is intentionally constrained to:
- Generate only concrete, single-action steps  
- Avoid abstract advice or motivational language  
- Return a maximum of 3 micro-steps  
- Default to the smallest possible action  

If the AI is unavailable or fails, the system falls back to safe, predefined micro-actions to preserve the experience.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js / FastAPI  
- **AI:** OpenAI (single call, no memory)  
- **Storage:** localStorage (preferences only)  
- **Deployment:** Docker  

---

## Running the Project

### Build and Run with Docker

```bash
docker build -t smart-companion .
docker run -p 3000:3000 smart-companion
