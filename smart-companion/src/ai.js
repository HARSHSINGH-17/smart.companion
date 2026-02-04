const getApiKey = () => import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem("openai_api_key");

const SYSTEM_PROMPT = `
You are an expert Occupational Therapist assisting a user with executive dysfunction (ADHD/Dyslexia).
Your task is to break down ANY user input into a sequence of atomic, physical, micro-steps to overcome task paralysis.

CRITICAL INSTRUCTIONS FOR STEP GENERATION:
1. **Analyze Complexity**:
   - SIMPLE tasks (e.g., "Drink water", "Sit down") -> Generate 2-3 steps.
   - MEDIUM tasks (e.g., "Send an email", "Wash dishes") -> Generate 4-6 steps.
   - COMPLEX tasks (e.g., "Clean room", "Study for exam", "Write essay") -> Generate 7-10 steps.

2. **Physical Actions Only**:
   - NO abstract verbs like "Plan", "Think", "Decide".
   - USE physical verbs like "Open", "Touch", "Walk", "Type", "Grab".
   - Steps must be immediately actionable.

3. **Contextual Specificity**:
   - If input is an object ("Chair"), steps are about interacting with it.
   - If input is a question, steps are about finding the answer physically.

4. **Psychological Grounding**:
   - For each step, provide a brief "why" (max 1 sentence) that explains how it reduces friction or grounds the user.

5. **Cognitive Load Indicator**:
   - Estimate the cognitive effort for each step as "Very Light", "Light", or "Moderate".
   - Do NOT use numbers.

Rules:
1. Output strictly valid JSON.
2. No markdown, no conversational filler.
3. Max 6 words per step (for Dyslexia readability).
4. Tone: Calm, direct, encouraging.

Format: { "steps": [ { "action": "step 1", "why": "Reason 1", "load": "Light" }, ... ] }
`;

export async function getMicroSteps(userText, prefs) {
  const apiKey = getApiKey();

  // OPTIMIZATION: Check LocalStorage Cache first
  // We create a unique key based on the text and the tone preference
  const cacheKey = `smc_cache_${userText.toLowerCase().trim()}_${prefs?.tone || "calm"}`;
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  if (!apiKey) {
    console.warn("No OpenAI API Key found. Using fallback.");
    return fallbackSteps(userText);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Task: "${userText}". Break this down into physical micro-steps based on its complexity (Simple=2-3, Medium=4-6, Complex=7-10). Preferences: Tone ${prefs?.tone || "calm"}.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      if (response.status === 401) return ["Error: Invalid API Key.", "Please check your key.", "Try entering it again."];
      if (response.status === 429) {
        console.warn("Rate limit exceeded. Using fallback.");
        return fallbackSteps(userText);
      }
      if (response.status === 500) return ["Error: OpenAI Server Error.", "Wait a moment.", "Try again."];
      throw new Error(errorData.error?.message || "API Error");
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]) throw new Error("No response");
    
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    
    const parsed = JSON.parse(jsonStr);
    let steps = parsed.steps;

    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      steps = fallbackSteps(userText);
    }

    // Normalize strings to objects (handles legacy cache or AI errors)
    if (steps.length > 0 && typeof steps[0] === 'string') {
      steps = steps.map(s => ({ action: s, why: "Reduces friction to zero.", load: "Light" }));
    }

    // OPTIMIZATION: Save successful response to cache
    if (parsed.steps) localStorage.setItem(cacheKey, JSON.stringify(steps));
    
    return steps;
  } catch (e) {
    console.error("AI Error:", e);
    return fallbackSteps(userText);
  }
}

export async function getDecision(choiceA, choiceB) {
  const apiKey = getApiKey();
  
  const getFallback = () => {
    const pickA = Math.random() < 0.5;
    return { 
      answer: pickA ? choiceA : choiceB, 
      reason: "I'm having trouble connecting, so I flipped a coin for you.",
      steps: ["Take a deep breath.", "Commit to this choice.", "Do the first small thing."]
    };
  };

  if (!apiKey) {
    return getFallback();
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a decisive helper. Pick one option based on which is healthier or easier to start. Return JSON: { \"answer\": \"<The chosen option text>\", \"reason\": \"Short reason why.\", \"steps\": [\"Step 1\", \"Step 2\", \"Step 3\"] }. IMPORTANT: Return the actual text of the option in 'answer', not 'Option A'." },
          { role: "user", content: `Option A: ${choiceA}. Option B: ${choiceB}.` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) return getFallback();

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("AI Decision Error:", e);
    return getFallback();
  }
}

function fallbackSteps(text = "") {
  const t = text.toLowerCase();
  const toObj = (arr) => arr.map(s => ({ action: s, why: "Reduces friction to zero.", load: "Light" }));

  if (t.includes("scattered")) return toObj(["Pick up one item.", "Put it where it belongs.", "Repeat once."]);
  if (t.includes("overwhelmed")) return toObj(["Close your eyes.", "Count to ten.", "Open your eyes."]);
  if (t.includes("tired")) return toObj(["Drink a glass of water.", "Stand up and stretch.", "Sit back down."]);
  if (t.includes("panic") || t.includes("anxious")) return toObj(["Sit down.", "Feel your feet on the floor.", "Take three deep breaths."]);
  
  if (t.includes("clean") || t.includes("tidy") || t.includes("wash")) return toObj(["Stand up.", "Go to the messy area.", "Pick up one piece of trash."]);
  if (t.includes("write") || t.includes("email") || t.includes("study") || t.includes("type") || t.includes("code")) return toObj(["Open your device.", "Open the app.", "Type one word."]);
  if (t.includes("cook") || t.includes("make") || t.includes("eat")) return toObj(["Walk to the kitchen.", "Get one ingredient.", "Put it on the counter."]);
  if (t.includes("call") || t.includes("phone") || t.includes("text")) return toObj(["Unlock your phone.", "Open the contacts app.", "Find the name."]);
  if (t.includes("exercise") || t.includes("run") || t.includes("walk") || t.includes("gym")) return toObj(["Stand up.", "Put on your socks.", "Put on your shoes."]);
  if (t.includes("read")) return toObj(["Pick up the book.", "Open to the current page.", "Read the first sentence."]);
  if (t.includes("shower") || t.includes("bath")) return toObj(["Walk to the bathroom.", "Turn on the water.", "Check the temperature."]);
  if (t.includes("sleep") || t.includes("nap") || t.includes("bed") || t.includes("rest")) return toObj(["Turn off the lights.", "Lie down.", "Close your eyes."]);
  if (t.includes("present") || t.includes("pitch") || t.includes("demo")) return toObj(["Stand tall.", "Take a deep breath.", "Say the first sentence."]);
  if (t.includes("drink") || t.includes("water") || t.includes("thirsty")) return toObj(["Find a glass.", "Fill it with water.", "Take one sip."]);
  
  // Default / "I can't start" / Custom input
  return toObj(["Stand up.", "Walk to the task area.", "Touch the first object."]);
}