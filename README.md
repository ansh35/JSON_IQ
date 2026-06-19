<div align="center">
  <h1 align="center">JSON-IQ</h1>
  <p align="center">
    <strong>The next-generation, AI-powered JSON developer toolkit.</strong>
  </p>
</div>

<br/>

## 🚀 Project Overview

**JSON-IQ** is a high-performance, intelligent JSON parsing and visualization tool built for modern developers. Going beyond standard formatters, JSON-IQ integrates an advanced LLM (Llama 3.1 via Groq) to provide instantaneous deep structural analysis, natural language error debugging, and one-click TypeScript interface generation. 

Designed with a stunning glassmorphic UI, lightning-fast Monaco Editor integration, and strict edge-case error handling, JSON-IQ provides a premium developer experience for managing complex data payloads.

---

## ✨ Feature List

- **Real-time Formatting & Minification**: Instantly transform unreadable data into pristine, formatted JSON or squash it down to raw minified strings.
- **AI-Powered Insights**: Leveraging Llama 3.1 to generate intelligent data summaries, identify mixed types, and flag complex nested object depths.
- **TypeScript Interface Generation**: Automatically convert nested JSON structures into strictly typed, production-ready TypeScript interfaces with a single click.
- **Smart Syntax Debugging**: When JSON fails to parse, the AI engine analyzes the exact character failure and provides a human-readable explanation of how to fix it.
- **Interactive Tree View**: A custom-built recursive tree visualization that auto-collapses deep nodes to prevent browser crashing on massive 150KB+ payloads.
- **Payload Analytics & Metrics**: Deep structural analytics displaying total keys, max depth, data type distribution, and a "Nesting Complexity Score".

---

## 🏗 Architecture Documentation

JSON-IQ utilizes a modern, serverless architecture optimized for edge deployments.

- **Framework**: **Next.js 16 (App Router)** powering both the frontend React client and the backend API routes.
- **State Management**: React Hooks (`useState`, `useRef`, `useTransition`) heavily optimized with debouncing and query-caching to prevent API thrashing.
- **Editor Engine**: **Monaco Editor** (the engine behind VS Code) embedded directly in the browser via `@monaco-editor/react`, utilizing Web Workers for syntax highlighting.
- **AI Integration**: The **Groq SDK** connects directly to the `llama-3.1-8b-instant` model. The backend acts as a secure proxy to inject system prompts and shield the API key.
- **Styling**: **Tailwind CSS v4** powering a bespoke design system featuring glassmorphism (`backdrop-blur`), absolute layout positioning, and highly responsive grid systems.
- **Icons & UI**: **Lucide React** for lightweight SVG icons and **Shadcn UI** for core primitive elements.

---

## ⚡ Technical Highlights

- **Anti-Spam API Protection**: Built a sophisticated caching and 2.5-second debounce system that allows instant UI transitions while protecting the Groq API from expensive keystroke spam.
- **Massive Payload Virtualization**: Developed a custom `JsonTree` algorithm that calculates recursive depth dynamically, automatically collapsing branches beyond `depth > 2` to prevent DOM-freeze when parsing payloads exceeding 100,000 nodes.
- **Type Safety**: Adheres strictly to modern TypeScript paradigms. Replaced all raw `any` typings with `unknown` type guards and recursive `JsonValue` interfaces, ensuring 100% Vercel deployment reliability.
- **Responsive Architecture**: Implemented a fluid Flexbox layout that seamlessly transitions from a side-by-side desktop dual-pane view to a stacked mobile view.

---

## 🛠 Getting Started

### Prerequisites
- Node.js 18+
- A [Groq API Key](https://console.groq.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/json-iq.git
   cd json-iq
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

<div align="center">
  <i>Built for Digital Heroes</i>
</div>
