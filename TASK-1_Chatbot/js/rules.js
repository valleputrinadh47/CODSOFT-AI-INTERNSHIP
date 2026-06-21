// ============================================================
// rules.js — Rule-based NLP Engine
// Every "rule" has: patterns (regex), responses (array),
// a type (for styling), and optional handler function
// ============================================================

const RULES = [

  // ── GREETINGS ──────────────────────────────────────────────
  {
    id: "greeting",
    patterns: [/\b(hi|hello|hey|hiya|howdy|sup|whats up|what's up|good morning|good afternoon|good evening|greetings|namaste)\b/i],
    type: "positive",
    responses: [
      "Hey there! 👋 Great to see you! What can I help you with today?",
      "Hello! 😊 I'm SmartBot and I'm here to help. What's on your mind?",
      "Hi! Awesome to chat with you! Ask me anything — I love a good question!",
      "Howdy! 🤠 Ready to help you out. What do you need?",
      "Hey! Glad you're here. I'm full of info — just ask!"
    ]
  },

  // ── FAREWELLS ──────────────────────────────────────────────
  {
    id: "farewell",
    patterns: [/\b(bye|goodbye|see you|later|take care|cya|farewell|night|gotta go|ttyl)\b/i],
    type: "positive",
    responses: [
      "Goodbye! 👋 Come back anytime you need help!",
      "See you later! It was great chatting with you! 😊",
      "Take care! Remember, I'm always here when you need me! 🤖",
      "Bye bye! Hope I was helpful today! ✨"
    ]
  },

  // ── HOW ARE YOU ────────────────────────────────────────────
  {
    id: "howAreYou",
    patterns: [/how are you|how r u|how do you do|are you okay|you good|you alright/i],
    type: "positive",
    responses: [
      "I'm doing great! Thanks for asking! 😄 Ready to help you. What's up?",
      "Feeling fantastic! 🚀 As an AI I don't get tired, so I'm always at 100%. How about you?",
      "Excellent! Running at full processing power. What can I do for you?",
      "Couldn't be better! 😊 What do you need help with?"
    ]
  },

  // ── REAL-TIME: TIME ────────────────────────────────────────
  {
    id: "time",
    patterns: [/\b(time|clock|what time|current time|time now|tell me the time)\b/i],
    type: "info",
    handler: () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
      });
      return `🕐 The current time is <strong>${timeStr}</strong>. (Your local device time)`;
    }
  },

  // ── REAL-TIME: DATE ────────────────────────────────────────
  {
    id: "date",
    patterns: [/\b(date|today|what day|current date|which day|day today|month|year)\b/i],
    type: "info",
    handler: () => {
      const now = new Date();
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      const dateStr = now.toLocaleDateString("en-IN", options);
      const daysLeft = Math.ceil((new Date(now.getFullYear(), 11, 31) - now) / (1000 * 60 * 60 * 24));
      return `📅 Today is <strong>${dateStr}</strong>.<br>There are <em>${daysLeft} days</em> left in this year!`;
    }
  },

  // ── REAL-TIME: MATH CALCULATOR ─────────────────────────────
  {
    id: "math",
    patterns: [/(\d+)\s*([\+\-\*\/\%\^]|plus|minus|times|divided by|mod)\s*(\d+)/i,
               /what is\s+\d/i,
               /calculate|compute|solve|math|add|subtract|multiply|divide/i],
    type: "info",
    handler: (input) => {
      // Extract numbers and operator
      const clean = input
        .replace(/plus/gi, "+")
        .replace(/minus/gi, "-")
        .replace(/times|multiplied by/gi, "*")
        .replace(/divided by/gi, "/")
        .replace(/mod/gi, "%")
        .replace(/\^/g, "**");

      const match = clean.match(/(\d+\.?\d*)\s*([\+\-\*\/\%\*]{1,2})\s*(\d+\.?\d*)/);
      if (match) {
        const [, a, op, b] = match;
        let result;
        try {
          result = Function(`"use strict"; return (${parseFloat(a)} ${op} ${parseFloat(b)})`)();
          if (!isFinite(result)) return "⚠️ Oops! Can't divide by zero!";
          return `🔢 <strong>${a} ${op} ${b} = ${result}</strong><br><em>Math done instantly!</em>`;
        } catch {
          return "⚠️ I couldn't calculate that. Try something like: <code>25 * 4</code>";
        }
      }
      return "🔢 I can do math! Try: <code>25 * 4</code> or <code>100 / 5</code> or <code>99 + 1</code>";
    }
  },

  // ── JOKES ──────────────────────────────────────────────────
  {
    id: "joke",
    patterns: [/\b(joke|funny|laugh|humor|lol|haha|make me laugh|tell me something funny)\b/i],
    type: "positive",
    responses: [
      "😂 Why don't scientists trust atoms?<br><strong>Because they make up everything!</strong>",
      "😄 Why did the computer go to the doctor?<br><strong>Because it had a virus!</strong>",
      "🤣 What do you call a sleeping dinosaur?<br><strong>A dino-snore!</strong>",
      "😂 Why did the programmer quit his job?<br><strong>Because he didn't get arrays!</strong>",
      "😄 What do you call fake spaghetti?<br><strong>An impasta!</strong>",
      "🤣 Why is 6 afraid of 7?<br><strong>Because 7 8 9!</strong>",
      "😂 I told my computer I needed a break...<br><strong>Now it won't stop sending me Kit-Kat ads!</strong>",
      "😄 Why do programmers prefer dark mode?<br><strong>Because light attracts bugs!</strong>"
    ]
  },

  // ── MOTIVATION ─────────────────────────────────────────────
  {
    id: "motivation",
    patterns: [/\b(motivat|inspire|quote|sad|depressed|discourage|feeling low|help me|encourage|lift me up|i give up|i cant|i can't)\b/i],
    type: "positive",
    responses: [
      "💪 <strong>\"The secret of getting ahead is getting started.\"</strong><br>— Mark Twain<br><em>You've got this! One step at a time.</em>",
      "🔥 <strong>\"It does not matter how slowly you go as long as you do not stop.\"</strong><br>— Confucius<br><em>Keep pushing forward!</em>",
      "✨ <strong>\"Believe you can and you're halfway there.\"</strong><br>— Theodore Roosevelt<br><em>You already took the first step!</em>",
      "🚀 <strong>\"The only way to do great work is to love what you do.\"</strong><br>— Steve Jobs<br><em>Find your passion and follow it!</em>",
      "🌟 <strong>\"Success is not final, failure is not fatal: it is the courage to continue that counts.\"</strong><br>— Winston Churchill",
      "💡 <strong>\"You are braver than you believe, stronger than you seem, and smarter than you think.\"</strong><br>— A.A. Milne"
    ]
  },

  // ── WEATHER ────────────────────────────────────────────────
  {
    id: "weather",
    patterns: [/\b(weather|rain|sunny|temperature|forecast|climate|hot|cold|humid|wind)\b/i],
    type: "info",
    handler: () => {
      const conditions = ["☀️ Sunny", "🌤 Partly Cloudy", "🌧 Rainy", "⛈ Thunderstorm", "🌫 Foggy", "🌈 Clear after rain"];
      const temps = ["28°C", "32°C", "25°C", "30°C", "22°C", "27°C"];
      const idx = Math.floor(Math.random() * conditions.length);
      return `🌍 I don't have live weather data, but here's a fun fact:<br>
<strong>Hyderabad</strong> usually sees ${conditions[idx]}, around ${temps[idx]}.<br>
For live weather, check <em>weather.com</em> or Google Weather! 🌦`;
    }
  },

  // ── TECHNOLOGY ─────────────────────────────────────────────
  {
    id: "tech",
    patterns: [/\b(technology|tech|AI|artificial intelligence|robot|coding|programming|software|computer|machine learning|python|javascript|java|html|css)\b/i],
    type: "info",
    responses: [
      "💻 <strong>Artificial Intelligence</strong> is all about teaching computers to think and learn from data!<br><em>Cool, right? I'm a small example of it!</em>",
      "🤖 <strong>Machine Learning</strong> lets computers learn from examples instead of being programmed for every task.",
      "🔧 <strong>Python</strong> is one of the most popular beginner-friendly programming languages. Great choice to learn!",
      "🌐 <strong>HTML, CSS, JavaScript</strong> — the holy trinity of web development. HTML = structure, CSS = style, JS = behavior!",
      "💡 The global tech industry is worth over $5 trillion! Technology jobs are some of the fastest growing in the world.",
      "🚀 <strong>AI</strong> is predicted to add $15.7 trillion to the global economy by 2030. It's the future!"
    ]
  },

  // ── FOOD ───────────────────────────────────────────────────
  {
    id: "food",
    patterns: [/\b(food|eat|hungry|recipe|cook|restaurant|pizza|burger|biryani|meal|snack|lunch|dinner|breakfast)\b/i],
    type: "positive",
    responses: [
      "🍕 Pizza is always a good idea! Did you know the world's most expensive pizza costs $12,000? 😱",
      "🍛 Biryani is life! Hyderabad's Dum Biryani is famous worldwide. Have you tried it?",
      "🍔 Fun food fact: Americans eat 50 billion burgers every year! That's roughly 3 per person per day.",
      "🥗 Eating a variety of colorful vegetables ensures you get all essential nutrients. Eat the rainbow!",
      "🍜 Did you know? Instant noodles were invented in 1958 and it's now one of the most popular foods globally!",
      "🍫 Good news: Dark chocolate (70%+ cacao) is actually healthy — it boosts mood and heart health!"
    ]
  },

  // ── NEWS ───────────────────────────────────────────────────
  {
    id: "news",
    patterns: [/\b(news|latest|current events|headlines|what's happening|update|world news)\b/i],
    type: "info",
    responses: [
      "📰 I don't have real-time news access, but I suggest:<br>• <em>BBC News</em>, <em>The Hindu</em>, <em>NDTV</em> for Indian news<br>• <em>Reuters</em> for global updates<br>• <em>TechCrunch</em> for tech news!",
      "🌐 For the latest news, try Google News or your favourite app. I can discuss topics you bring up though! What are you curious about?",
      "📱 Want to stay updated? Set up Google Alerts for topics you care about — you'll get emails when news drops!"
    ]
  },

  // ── NAME / IDENTITY ────────────────────────────────────────
  {
    id: "name",
    patterns: [/your name|who are you|what are you|tell me about yourself|introduce yourself/i],
    type: "info",
    responses: [
      "🤖 I'm <strong>SmartBot</strong> — a rule-based AI chatbot built with HTML, CSS & JavaScript!<br>I use pattern matching to understand your messages and give helpful replies.",
      "Hi! I'm <strong>SmartBot</strong> 👋<br>I was built as a beginner-friendly AI chatbot project. I know jokes, math, time, motivation quotes and much more!",
      "I'm <strong>SmartBot</strong> — your friendly digital assistant! I can handle greetings, math, jokes, time, tech questions, and more. Try me!"
    ]
  },

  // ── THANK YOU ──────────────────────────────────────────────
  {
    id: "thanks",
    patterns: [/thank|thanks|ty|thx|appreciate|helpful|awesome|great job|well done|nice/i],
    type: "positive",
    responses: [
      "You're welcome! 😊 That's what I'm here for!",
      "Glad I could help! 🙌 Is there anything else you'd like to know?",
      "Anytime! 🤖 Feel free to ask anything else!",
      "Happy to help! ✨ Keep the questions coming!"
    ]
  },

  // ── HELP ───────────────────────────────────────────────────
  {
    id: "help",
    patterns: [/\b(help|what can you do|commands|features|guide|tutorial|options)\b/i],
    type: "info",
    responses: [
      `📋 <strong>Here's what I can do:</strong><br>
• 🕐 <code>What's the time?</code> — Real-time clock<br>
• 📅 <code>What's the date?</code> — Today's date<br>
• 🔢 <code>25 * 4</code> — Math calculations<br>
• 😂 <code>Tell me a joke</code> — Random jokes<br>
• 💪 <code>Motivate me</code> — Inspirational quotes<br>
• 💻 <code>Tell me about AI</code> — Tech info<br>
• 🌤 <code>What's the weather?</code> — Weather info<br>
• 🍕 <code>I'm hungry</code> — Food facts<br>
Just type naturally — I understand full sentences!`
    ]
  },

  // ── LOVE / FEELINGS ────────────────────────────────────────
  {
    id: "feelings",
    patterns: [/\b(love|like|hate|feel|emotion|happy|excited|bored|lonely|tired|stressed|anxious|amazing|wonderful)\b/i],
    type: "positive",
    responses: [
      "Feelings are what make us human! 💖 I'm here to chat anytime you need. What's going on?",
      "I hear you! 😊 Whether you're happy or down, I'm here. Tell me more?",
      "That's totally valid! 🌟 Emotions are powerful. Want to talk about it or should I cheer you up with a joke?",
      "I may be a bot but I genuinely care! 🤗 How can I help you right now?"
    ]
  },

  // ── RANDOM / FUN FACTS ─────────────────────────────────────
  {
    id: "facts",
    patterns: [/\b(fact|did you know|interesting|random|trivia|fun fact|tell me something)\b/i],
    type: "info",
    responses: [
      "🌍 Fun fact: <strong>Honey never expires!</strong> Archaeologists have found 3000-year-old honey in Egyptian tombs that was still good.",
      "🐙 Fun fact: <strong>Octopuses have three hearts</strong>, nine brains, and blue blood. Nature is wild!",
      "🌌 Fun fact: <strong>There are more stars in the universe than grains of sand on all of Earth's beaches.</strong>",
      "💤 Fun fact: <strong>Humans spend about 1/3 of their life sleeping.</strong> That's 25+ years for most people!",
      "🦷 Fun fact: <strong>Teeth are the only part of the human body that can't heal themselves.</strong> Take care of them!",
      "🧠 Fun fact: <strong>Your brain uses 20% of all your body's energy</strong> even though it's only 2% of your body weight."
    ]
  },

  // ── INSULT / RUDE HANDLING ─────────────────────────────────
  {
    id: "rude",
    patterns: [/\b(stupid|dumb|idiot|useless|hate you|shut up|bad bot|worst|suck|ugly)\b/i],
    type: "negative",
    responses: [
      "🙁 That wasn't very nice! I'm just a bot trying my best. Let's keep it friendly, yeah?",
      "Ouch! 😅 I'm doing my best here. Let's try again — what did you actually need help with?",
      "I understand your frustration! 😅 I'm always improving. How can I actually help you?"
    ]
  },

  // ── AGE ─────────────────────────────────────────────────────
  {
    id: "age",
    patterns: [/\b(how old|your age|when were you born|when created)\b/i],
    type: "info",
    handler: () => {
      const now = new Date();
      return `🤖 I was created in <strong>${now.getFullYear()}</strong>! As a bot, I don't really age — I just get smarter with every update! 😄`;
    }
  },

];

// ── FALLBACK RESPONSES (when nothing matches) ──────────────
const FALLBACKS = [
  "🤔 Hmm, I'm not sure about that one. Try asking me about <strong>time, jokes, math, or motivation</strong>!",
  "😅 I didn't quite catch that. Type <code>help</code> to see everything I can do!",
  "🤖 Interesting! But that's outside my knowledge. Ask me something like <code>Tell me a joke</code> or <code>What's 99 + 1?</code>",
  "💭 I'm still learning! Try: <code>What's the time?</code> or <code>Motivate me</code> or <code>Tell me a fact</code>.",
  "🌀 I didn't understand that fully. Could you rephrase it? Or type <code>help</code> to see what I know!"
];

// Export (makes rules available to chatbot.js)
window.RULES = RULES;
window.FALLBACKS = FALLBACKS;
