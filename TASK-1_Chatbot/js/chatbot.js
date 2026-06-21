// ============================================================
// chatbot.js — Core Chatbot Engine
// Handles: pattern matching, typing simulation, real-time
// clock, session tracking, auto-scroll, accessibility
// ============================================================

// ── DOM ELEMENTS ───────────────────────────────────────────
const chatBox        = document.getElementById("chatBox");
const userInput      = document.getElementById("userInput");
const sendBtn        = document.getElementById("sendBtn");
const typingIndicator= document.getElementById("typingIndicator");
const clearBtn       = document.getElementById("clearBtn");
const msgCountEl     = document.getElementById("msgCount");
const sessionTimeEl  = document.getElementById("sessionTime");
const chips          = document.querySelectorAll(".chip");
const topicItems     = document.querySelectorAll(".topic-item");

// ── STATE ──────────────────────────────────────────────────
let messageCount = 0;
let sessionStart = Date.now();
let lastActiveTopic = null;

// ── REAL-TIME SESSION TIMER ─────────────────────────────────
setInterval(() => {
  const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
  if (elapsed < 60) {
    sessionTimeEl.textContent = `${elapsed}s`;
  } else if (elapsed < 3600) {
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    sessionTimeEl.textContent = `${m}m ${s}s`;
  } else {
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    sessionTimeEl.textContent = `${h}h ${m}m`;
  }
}, 1000);

// ── TIMESTAMP HELPER ───────────────────────────────────────
function getTimestamp() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true
  });
}

// ── SET WELCOME TIME ───────────────────────────────────────
document.getElementById("botWelcomeTime").textContent = getTimestamp();

// ── FIND MATCHING RULE ────────────────────────────────────
function findRule(input) {
  const text = input.trim().toLowerCase();
  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) {
        return rule;
      }
    }
  }
  return null;
}

// ── GET BOT RESPONSE ──────────────────────────────────────
function getBotResponse(input) {
  const rule = findRule(input);

  if (rule) {
    // Highlight active topic in sidebar
    highlightTopic(rule.id);

    if (rule.handler) {
      // Dynamic real-time response
      return { text: rule.handler(input), type: rule.type || "info" };
    } else {
      // Pick random response from array
      const arr = rule.responses;
      const text = arr[Math.floor(Math.random() * arr.length)];
      return { text, type: rule.type || "info" };
    }
  }

  // Fallback
  const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
  return { text: fallback, type: "neutral" };
}

// ── HIGHLIGHT SIDEBAR TOPIC ───────────────────────────────
function highlightTopic(ruleId) {
  const mapping = {
    greeting: "hello", farewell: "hello", howAreYou: "hello",
    time: "time", date: "time",
    math: "math",
    joke: "joke",
    motivation: "motivate",
    weather: "weather",
    news: "news",
    help: "help",
    tech: "tech",
    food: "food",
    facts: "help"
  };

  const topicKey = mapping[ruleId];
  if (!topicKey || topicKey === lastActiveTopic) return;

  topicItems.forEach(item => item.classList.remove("active"));
  const match = document.querySelector(`.topic-item[data-topic="${topicKey}"]`);
  if (match) {
    match.classList.add("active");
    lastActiveTopic = topicKey;
  }
}

// ── ADD MESSAGE TO CHAT ───────────────────────────────────
function addMessage(text, sender = "bot", type = "neutral") {
  const wrapper = document.createElement("div");
  wrapper.classList.add("msg", sender === "bot" ? "bot-msg" : "user-msg");

  const avatar = document.createElement("div");
  avatar.classList.add("avatar", sender === "bot" ? "bot-avatar" : "user-avatar");
  avatar.textContent = sender === "bot" ? "🤖" : "🧑";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  if (type !== "neutral") bubble.classList.add(type);

  bubble.innerHTML = text;

  const timeEl = document.createElement("span");
  timeEl.classList.add("msg-time");
  timeEl.textContent = getTimestamp();
  bubble.appendChild(timeEl);

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  chatBox.appendChild(wrapper);

  // Update message counter
  messageCount++;
  msgCountEl.textContent = messageCount;

  // Smooth scroll to bottom
  scrollToBottom();
}

// ── SCROLL TO BOTTOM ──────────────────────────────────────
function scrollToBottom() {
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
}

// ── SHOW / HIDE TYPING INDICATOR ─────────────────────────
function showTyping() {
  typingIndicator.classList.add("show");
  scrollToBottom();
}
function hideTyping() {
  typingIndicator.classList.remove("show");
}

// ── CALCULATE REALISTIC TYPING DELAY ─────────────────────
function typingDelay(text) {
  // 30ms per character, min 600ms, max 2500ms
  const base = Math.min(text.length * 30, 2500);
  return Math.max(base, 600);
}

// ── MAIN SEND FUNCTION ────────────────────────────────────
function sendMessage(overrideText = null) {
  const text = (overrideText || userInput.value).trim();
  if (!text) return;

  // Add user message
  addMessage(text, "user");
  userInput.value = "";
  autoResize();
  sendBtn.disabled = true;

  // Show typing animation
  showTyping();

  // Get bot response
  const { text: responseText, type } = getBotResponse(text);

  // Simulate realistic typing delay
  setTimeout(() => {
    hideTyping();
    addMessage(responseText, "bot", type);
    sendBtn.disabled = false;
    userInput.focus();
  }, typingDelay(responseText));
}

// ── AUTO-RESIZE TEXTAREA ──────────────────────────────────
function autoResize() {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + "px";
}

// ── EVENT LISTENERS ───────────────────────────────────────

// Send on Enter (Shift+Enter = newline)
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto-resize as user types
userInput.addEventListener("input", autoResize);

// Send button click
sendBtn.addEventListener("click", () => sendMessage());

// Quick chip buttons
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    sendMessage(chip.dataset.msg);
  });
});

// Sidebar topic buttons (inject quick questions)
topicItems.forEach(item => {
  item.addEventListener("click", () => {
    const topicMessages = {
      hello: "Hello there!",
      weather: "What's the weather like?",
      time: "What's the current time?",
      math: "What is 25 * 4?",
      joke: "Tell me a joke!",
      news: "What's the latest news?",
      help: "Help",
      motivate: "Motivate me!",
      tech: "Tell me about AI",
      food: "I'm hungry! Tell me something about food."
    };
    const msg = topicMessages[item.dataset.topic];
    if (msg) sendMessage(msg);
  });
});

// Clear chat
clearBtn.addEventListener("click", () => {
  // Remove all messages except welcome
  const messages = chatBox.querySelectorAll(".msg:not(#welcomeMsg)");
  messages.forEach(m => {
    m.style.opacity = "0";
    m.style.transform = "scale(0.9)";
    m.style.transition = "all 0.2s";
    setTimeout(() => m.remove(), 200);
  });
  messageCount = 0;
  msgCountEl.textContent = "0";
  lastActiveTopic = null;
  topicItems.forEach(t => t.classList.remove("active"));
  sessionStart = Date.now();
});

// ── AUTO FOCUS INPUT ON LOAD ──────────────────────────────
window.addEventListener("load", () => {
  userInput.focus();
});

// ── KEYBOARD SHORTCUT: / focuses input ───────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== userInput) {
    e.preventDefault();
    userInput.focus();
  }
});

console.log("✅ SmartBot loaded successfully!");
console.log("📋 Rules loaded:", RULES.length);
console.log("⌨️  Press '/' anywhere to focus the chat input");
