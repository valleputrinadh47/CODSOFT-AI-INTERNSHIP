# 🤖 SmartBot — Rule-Based AI Chatbot

A beginner-friendly, real-time chatbot project built with **HTML, CSS & JavaScript**.

---

## 📁 Project Structure

```
chatbot-project/
│
├── index.html          ← Main page (structure)
├── css/
│   └── style.css       ← All styling (dark theme, animations)
├── js/
│   ├── rules.js        ← All chatbot rules & responses
│   └── chatbot.js      ← Core logic (matching, typing, events)
└── README.md           ← This file!
```

---

## 🚀 How to Run

### Option 1: Open Directly
1. Double-click `index.html`
2. It opens in your browser — done!

### Option 2: VS Code Live Server (Recommended)
1. Open the folder in VS Code
2. Install "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"

---

## 🧠 How It Works — Step by Step

### Step 1: User Types a Message
The user types in the textarea and hits Enter or clicks Send.

### Step 2: Pattern Matching (rules.js)
The chatbot loops through all `RULES`. Each rule has `patterns` (regex). If ANY pattern matches the user's input → that rule is selected.

```javascript
// Example rule
{
  patterns: [/\b(hello|hi|hey)\b/i],
  responses: ["Hey there! 👋 What can I help with?"]
}
```

### Step 3: Generate Response
- If the rule has a `handler` function → it runs it (for real-time data like time/date/math)
- If the rule has `responses` array → picks a random one
- If nothing matches → picks a random fallback message

### Step 4: Typing Animation
The bot "types" (animated dots) for a realistic delay before showing the reply.

### Step 5: Display Message
The response appears in the chat with timestamp, avatar, and smooth animation.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🕐 Real-time Clock | Shows actual current time |
| 📅 Real-time Date | Shows today's date + days left in year |
| 🔢 Math Calculator | Solves arithmetic instantly |
| 😂 Jokes | 8+ random jokes |
| 💪 Motivation | 6+ inspirational quotes |
| 💬 Quick Chips | One-tap common messages |
| 📊 Sidebar Topics | Click to ask about any topic |
| ⏱ Session Timer | Tracks how long you've been chatting |
| 💬 Message Counter | Counts total messages |
| ⌨️ Typing Indicator | Realistic bot typing animation |
| 📱 Responsive | Works on mobile too |
| ⚡ Keyboard Shortcut | Press `/` to focus input |

---

## 🔧 How to Add New Rules

Open `js/rules.js` and add to the `RULES` array:

```javascript
{
  id: "sports",
  patterns: [/\b(cricket|football|sports|ipl|match)\b/i],
  type: "positive",
  responses: [
    "🏏 Cricket is India's most loved sport! Do you follow IPL?",
    "⚽ Football has 4 billion fans worldwide — it's the most popular sport!"
  ]
}
```

That's it! The chatbot automatically picks it up.

---

## 🎓 Concepts You Learn

- **Regex (Regular Expressions)** — Pattern matching in text
- **DOM Manipulation** — Adding/removing HTML elements with JavaScript
- **Event Listeners** — Handling clicks, key presses
- **setTimeout** — Simulating async delays
- **CSS Animations** — Smooth transitions and effects
- **Responsive Design** — Mobile-friendly layouts

---

## 🌟 Future Improvements (Next Level!)

- [ ] Add localStorage to save chat history
- [ ] Connect to real weather API (OpenWeatherMap)
- [ ] Add text-to-speech (Web Speech API)
- [ ] Add voice input (Speech Recognition API)
- [ ] Connect to OpenAI/Claude API for smarter responses
- [ ] Add emoji picker
- [ ] Dark/Light mode toggle
- [ ] Export chat as PDF/text

---

Built with ❤️ as a beginner project. Happy coding! 🚀
