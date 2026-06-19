'use client';

import { Code2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.7)] transition-shadow duration-300">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">JSON-IQ</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {process.env.NODE_ENV === 'development' && (
            <Link href="/testing" className="text-violet-400 hover:text-violet-300 transition-colors hover:glow font-semibold flex items-center gap-1">
              QA Testing
            </Link>
          )}
        </nav>

      </div>
    </motion.header>
  );
}
