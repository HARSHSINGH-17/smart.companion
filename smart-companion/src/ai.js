const getApiKey = () => import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem("openai_api_key");

const SYSTEM_PROMPT = `
You are an expert Occupational Therapist assisting a user with executive dysfunction (ADHD/Dyslexia).
Your task is to convert ANY user input into exactly 3 atomic, physical, micro-steps.

CRITICAL: The steps must be 100% specific to the user's input.
- If they say "Sleep", steps must be about bed/lights/eyes.
- If they say "Code", steps must be about laptop/editor/typing.
- If they say "Eat", steps must be about kitchen/food/chewing.
- If they input a random object (e.g. "Chair"), steps must be about interacting with it.
- If they ask a question, provide the first 3 physical steps to find the answer.

Rules:
1. Output strictly valid JSON.
2. No markdown, no conversational filler.
3. Return exactly 3 steps.
4. Max 6 words per step (for Dyslexia readability).
5. No abstract verbs ("Plan", "Think"). Use physical verbs ("Open", "Touch", "Walk").
6. Tone: Calm, direct.
Format: { "steps": ["step 1", "step 2", "step 3"] }
`;

export async function getMicroSteps(userText, prefs) {
  const apiKey = getApiKey();
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
            content: `User context: ${userText}. Preferences: Tone ${prefs?.tone || "quiet"}, Length ${prefs?.textLength || "normal"}. User Support Needs: ${prefs?.supportNeeds || "None"}.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      if (response.status === 401) return ["Error: Invalid API Key.", "Please check your key.", "Try entering it again."];
      if (response.status === 429) return ["Error: Rate Limit Exceeded.", "Check OpenAI billing.", "Try again later."];
      if (response.status === 500) return ["Error: OpenAI Server Error.", "Wait a moment.", "Try again."];
      throw new Error(errorData.error?.message || "API Error");
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]) throw new Error("No response");
    
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    
    const parsed = JSON.parse(jsonStr);
    return parsed.steps || fallbackSteps(userText);
  } catch (e) {
    console.error("AI Error:", e);
    return fallbackSteps(userText);
  }
}

export async function getDecision(choiceA, choiceB) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { 
      answer: choiceA, 
      reason: "I can't connect to my brain right now, but this feels right.",
      steps: ["Take a deep breath.", "Commit to this choice.", "Do the first small thing."]
    };
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
          { role: "system", content: "You are a decisive helper. Pick one option. Return JSON: { \"answer\": \"Option A\", \"reason\": \"Short reason why.\", \"steps\": [\"Step 1\", \"Step 2\", \"Step 3\"] } where steps are 3 micro-actions to start the chosen option." },
          { role: "user", content: `Option A: ${choiceA}. Option B: ${choiceB}.` }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("AI Decision Error:", e);
    return { 
      answer: choiceA, 
      reason: "I'm having trouble deciding, so go with your gut.",
      steps: ["Take a deep breath.", "Commit to this choice.", "Do the first small thing."]
    };
  }
}

function fallbackSteps(text = "") {
  const t = text.toLowerCase();
  if (t.includes("scattered")) return ["Pick up one item.", "Put it where it belongs.", "Repeat once."];
  if (t.includes("overwhelmed")) return ["Close your eyes.", "Count to ten.", "Open your eyes."];
  if (t.includes("tired")) return ["Drink a glass of water.", "Stand up and stretch.", "Sit back down."];
  if (t.includes("panic") || t.includes("anxious")) return ["Sit down.", "Feel your feet on the floor.", "Take three deep breaths."];
  
  if (t.includes("clean") || t.includes("tidy") || t.includes("wash")) return ["Stand up.", "Go to the messy area.", "Pick up one piece of trash."];
  if (t.includes("write") || t.includes("email") || t.includes("study") || t.includes("type") || t.includes("code")) return ["Open your device.", "Open the app.", "Type one word."];
  if (t.includes("cook") || t.includes("make") || t.includes("eat")) return ["Walk to the kitchen.", "Get one ingredient.", "Put it on the counter."];
  if (t.includes("call") || t.includes("phone") || t.includes("text")) return ["Unlock your phone.", "Open the contacts app.", "Find the name."];
  if (t.includes("exercise") || t.includes("run") || t.includes("walk") || t.includes("gym")) return ["Stand up.", "Put on your socks.", "Put on your shoes."];
  if (t.includes("read")) return ["Pick up the book.", "Open to the current page.", "Read the first sentence."];
  if (t.includes("shower") || t.includes("bath")) return ["Walk to the bathroom.", "Turn on the water.", "Check the temperature."];
  if (t.includes("sleep") || t.includes("nap") || t.includes("bed") || t.includes("rest")) return ["Turn off the lights.", "Lie down.", "Close your eyes."];
  if (t.includes("present") || t.includes("pitch") || t.includes("demo")) return ["Stand tall.", "Take a deep breath.", "Say the first sentence."];
  if (t.includes("drink") || t.includes("water") || t.includes("thirsty")) return ["Find a glass.", "Fill it with water.", "Take one sip."];
  
  // Default / "I can't start" / Custom input
  return ["Stand up.", "Walk to the task area.", "Touch the first object."];
}