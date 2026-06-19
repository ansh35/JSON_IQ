'use client';

import { useState, useEffect, useTransition, useRef } from "react";
import { Hero } from "@/components/Hero";
import { EditorArea } from "@/components/EditorArea";
import { OutputArea } from "@/components/OutputArea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, Code2 } from "lucide-react";
import Link from "next/link";

const DEFAULT_JSON = `{\n  "hello": "world",\n  "features": [\n    "Validation",\n    "Formatting",\n    "AI Analysis"\n  ]\n}`;

export default function Home() {
  const [input, setInput] = useState(DEFAULT_JSON);
  const [mode, setMode] = useState<'format' | 'minify' | 'ai' | 'analytics' | 'ts' | 'tree'>('format');

  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const previousMode = useRef(mode);
  const aiCache = useRef<Record<string, string>>({});

  useEffect(() => {
    const isAiMode = mode === 'ai' || mode === 'ts';
    const modeChanged = previousMode.current !== mode;
    previousMode.current = mode;

    // 2500ms debounce if typing in AI mode, 150ms otherwise
    const delay = isAiMode && !modeChanged ? 2500 : 150;

    const handler = setTimeout(() => {
      startTransition(async () => {
        if (!input.trim()) {
          setOutput('');
          setError(null);
          return;
        }

        let parsed = null;
        let parseError = null;

        try {
          parsed = JSON.parse(input);
          setError(null);
        } catch (err: unknown) {
          parseError = err instanceof Error ? err.message : 'Unknown parsing error';
          setError(parseError || 'Invalid JSON syntax');
        }

        if (mode === 'ai' || mode === 'ts') {
          const cacheKey = `${mode}:${input}`;
          if (aiCache.current[cacheKey]) {
            setOutput(aiCache.current[cacheKey]);
            return;
          }

          try {
            const res = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonString: input,
                error: parseError,
                action: mode === 'ts' && !parseError ? 'ts' : 'insights'
              })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            aiCache.current[cacheKey] = data.result;
            setOutput(data.result);
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setOutput(`**AI Request Failed**\n${msg}`);
          }
        } else if (mode === 'analytics') {
          // Handled locally in OutputArea, do not throw error or clear if valid
          if (parseError) {
            setOutput('');
          }
        } else {
          if (parseError) {
            setOutput('');
            return;
          }
          let formatted = '';
          if (mode === 'format') {
            formatted = JSON.stringify(parsed, null, 2);
          } else if (mode === 'minify') {
            formatted = JSON.stringify(parsed);
          }
          setOutput(formatted);
        }
      });
    }, delay);

    return () => clearTimeout(handler);
  }, [input, mode]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Enter = Validate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        try {
          JSON.parse(input);
          toast.success("Valid JSON");
        } catch (err: unknown) {
          toast.error("Invalid JSON");
        }
      }

      // Ctrl + Shift + F = Format
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setMode('format');
        toast.info("Switched to Format Mode");
      }

      // Ctrl + Shift + M = Minify
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setMode('minify');
        toast.info("Switched to Minify Mode");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return (
    <>
      <main className="flex-1 relative z-10 flex flex-col">
        {/* JSON-IQ Logo Button */}
        <Link
          href="/"
          className="fixed top-6 left-6 z-50 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.7)] transition-shadow duration-300">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">JSON-IQ</span>
        </Link>

        {/* Trial Submission Floating Element */}
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noreferrer"
          className="fixed top-6 right-6 z-50 group flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/20 p-4 pr-6 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all hover:scale-105 active:scale-95 hover:border-primary/60 text-left"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-inner flex-shrink-0">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col min-w-[160px]">
            <span className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">Trial Submission</span>
            <span className="text-base font-black text-white leading-tight mb-0.5 tracking-wide">Ansh Khare</span>
            <span className="text-sm font-semibold text-white/90 leading-tight mb-2">khareansh075@gmail.com</span>
            <div className="inline-flex items-center text-[11px] font-bold text-primary/80 uppercase tracking-widest group-hover:text-primary transition-colors">
              Built for Digital Heroes <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </div>
        </a>

        <Hero />

        <motion.section
          id="workspace"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.2 }}
          className="container mx-auto px-4 py-8 flex-1 flex flex-col lg:flex-row gap-8 mb-24 relative z-10"
        >
          <div className="flex-1 min-h-[600px] h-full flex flex-col">
            <EditorArea
              value={input}
              onChange={setInput}
              onClear={() => setInput('')}
            />
          </div>
          <div className="flex-1 min-h-[600px] h-full flex flex-col">
            <OutputArea
              value={output}
              error={error}
              mode={mode}
              onModeChange={setMode}
              isLoading={isPending}
              rawInput={input}
            />
          </div>
        </motion.section>
      </main>
    </>
  );
}
