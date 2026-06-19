import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const { jsonString, error, action = 'insights' } = await req.json();
    
    // Protect against free-tier rate limits (approx 6000 tokens / 24,000 chars)
    const MAX_CHARS = 15000;
    if (jsonString && jsonString.length > MAX_CHARS) {
      return NextResponse.json({ 
        error: `Payload too large for AI Analysis. Your JSON is ${(jsonString.length / 1024).toFixed(1)} KB, which exceeds the free tier API limit. Please use a smaller sample (under ~15 KB).` 
      }, { status: 413 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured in .env.local" }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    let prompt = "";
    if (error) {
      // Feature 1: Explain JSON Errors
      prompt = `You are a strict, helpful JSON expert. The following JSON string failed to parse with the error: "${error}".

Analyze the string and provide a human-friendly explanation of why it failed. Provide the corrected JSON string if possible.
Keep your response concise and format it in Markdown.

JSON String:
${jsonString}`;
    } else if (action === 'ts') {
      // Feature: TypeScript Interface Generator
      prompt = `You are an expert TypeScript developer. Analyze the following valid JSON structure and generate the corresponding TypeScript interfaces.
Provide ONLY the TypeScript code block, cleanly formatted. Use a Root interface for the top-level structure.

JSON String:
${jsonString}`;
    } else {
      // Features 2 & 3: JSON Summary & Developer Insights
      prompt = `You are a JSON expert. Analyze the following valid JSON structure.
Provide:
1. **Summary**: A short summary of what the data represents.
2. **Insights**: Main object types, maximum nested depth, total key counts, and any potential issues (e.g., mixed types, large arrays).

Keep your response concise and format it in clean Markdown.

JSON String:
${jsonString}`;
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
    });

    const response = chatCompletion.choices[0]?.message?.content || "No insights generated.";

    return NextResponse.json({ result: response });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
