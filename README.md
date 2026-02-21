# Munshi

<p align="center">
  <img src="assets/logo-munshi.jpeg" height="80" alt="Munshi Logo" />
</p>



https://github.com/user-attachments/assets/75c2a046-5561-49c0-b8e7-580714a4ced5



<p align="center">
  <b>Aapke dukaan ka Munshi</b>
</p>

<p align="center">
  <a href="#features">Features</a> • <a href="#tech-stack">Tech Stack</a> • <a href="#getting-started">Get Started</a> • <a href="#api">API</a>
</p>

---

Munshi is an AI-powered mobile assistant designed specifically for small Indian local shops — kirana stores, chai stalls, cafes, and neighborhood vendors. It speaks to you in **Hindi** (Roman script), understands your voice, and helps you manage your entire shop from inventory to insights — without needing to be a tech expert.

Whether you want to know your top-selling products, check what stock is running low, or simply ask "Aaj kitna paisa gaya?" — Munshi has your back.

---

## Features

| Feature | Description |
|---------|-------------|
| **Voice & Text Chat** | Talk to Munshi in Hindi — voice input gets Hindi responses spoken back to you |
| **Stock Management** | Add, update, and track products with purchase price, selling price, and expiry dates |
| **Analytics Dashboard** | Visual sales charts, revenue tracking, top/worst selling products |
| **Transactions** | Record sales with Cash, UPI, or Credit payment tracking |
| **Quick Scan** | Barcode scanning for instant product lookup |
| **AI Conversations** | Ask anything about your business — "Kis product se sabse zyada profit ho raha hai?" |

---

## Tech Stack

### Server
- **Runtime:** Node.js + Express
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Better-Auth
- **AI:** OpenAI Agents SDK + Ollama (local LLM)
- **Voice:** Sarvam AI (Hindi STT/TTS)

### Client
- **Framework:** Expo (React Native)
- **Styling:** NativeWind + Tailwind CSS
- **Animations:** Moti
- **UI Components:** Radix UI Primitives
- **Icons:** Phosphor Icons + Lucide

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm
- Ollama (for local AI)
- Sarvam AI API key (for voice features)

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/binit2-1/munshi.git
cd munshi

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Setup

Create `.env` files in both `server/` and `client/` directories:

**Server `.env`:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/munshi"
BETTER_AUTH_SECRET="your-secret-key"
OLLAMA_BASE_URL="http://localhost:11434"
SARVAM_API_KEY="your-sarvam-key"
PORT=3000
```

**Client `.env`:**
```env
EXPO_PUBLIC_BASE_URL="http://localhost:3000"
```

### Run the App

```bash
# Terminal 1: Start the server
cd server
npm dev

# Terminal 2: Start the Expo app
cd client
npm dev
```

### Database Setup

```bash
cd server
npx prisma migrate dev
npx prisma db seed  # Optional: seed sample data
```

---

## API Overview

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/signin` | POST | Login user |
| `/api/auth/signout` | POST | Logout user |

### Products
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/products` | GET | List all products |
| `/products` | POST | Create new product |
| `/products/:id` | PUT | Update product |
| `/products/:id` | DELETE | Delete product |

### Stock
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/stock` | GET | Get all stock levels |
| `/stock` | POST | Update stock quantity |

### Transactions
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/transactions` | GET | List transactions |
| `/transactions` | POST | Create new transaction |

### AI Assistant
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ai/response` | GET | Text chat with AI |
| `/ai/audio/response` | POST | Voice chat with AI |
| `/ai/history` | GET | Get chat history |

---

## 📱 Screenshots

<div align="center">
  <img src="assets/dashboard.jpeg" width="200" alt="Dashboard" />
  <img src="assets/chat.jpeg" width="200" alt="AI Chat" />
  <img src="assets/stock.jpeg" width="200" alt="Products" />
</div>

---

## How the AI Works

Munshi's AI agent uses the **OpenAI Agents SDK** with tools that execute database commands:

1. **User asks in Hindi** → "Mujhe batao konsa product kam becha?"
2. **Agent parses intent** → Calls appropriate CLI tool
3. **Tool queries PostgreSQL** → Returns JSON data
4. **Agent responds in Hindi** → "Aapka sabse kam bechne wala product Parle-G hai..."

All conversations are stored in chat history with Redis-powered sessions for context.

---

## License

MIT License — feel free to use and modify for your shop!

---

## Acknowledgments

- [Sarvam AI](https://sarvam.ai) — For Hindi voice capabilities
- [Ollama](https://ollama.com) — For local LLM inference
- [Better-Auth](https://better-auth.com) — For seamless authentication

---

<p align="center">
  Made with ❤️ for local shop owners across India
</p>
