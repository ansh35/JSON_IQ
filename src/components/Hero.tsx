'use client';

import { Code2, CheckCircle2, AlignLeft, Minimize2, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Instant Validation",
    description: "Catch syntax errors before they break your app with real-time JSON validation.",
    icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
  },
  {
    title: "Smart Formatting",
    description: "Automatically format your messy JSON strings into clean, readable, indented structures.",
    icon: <AlignLeft className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Lossless Minification",
    description: "Strip out whitespace and compress payloads for smaller network requests instantly.",
    icon: <Minimize2 className="w-5 h-5 text-amber-400" />,
  },
  {
    title: "AI Insights",
    description: "Leverage AI to deeply understand your data schemas and spot anomalies.",
    icon: <Sparkles className="w-5 h-5 text-purple-400" />,
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function Hero() {
  return (
    <section className="relative pt-8 pb-8 md:pt-12 md:pb-12 overflow-hidden">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 relative z-10 max-w-6xl"
      >
        <div className="glass-panel rounded-[2.5rem] border border-white/10 p-6 md:p-8 lg:p-12 flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          {/* Inner subtle glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

          <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-4 leading-tight relative z-10">
            The Intelligent Way to <br className="hidden md:block" />
            <span className="animated-gradient-text">Master Your JSON</span>
          </motion.h1>
          
          <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 leading-relaxed relative z-10">
            Validate, format, minify, and deeply understand your JSON structures with our state-of-the-art developer tooling. Built for speed and precision.
          </motion.p>

          <motion.button 
            variants={item}
            onClick={() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 mb-10 shadow-[0_0_30px_rgba(168,85,247,0.4)] relative z-10"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full relative z-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black/40 border border-white/5 rounded-2xl p-6 text-left transition-all hover:border-white/10 hover:bg-black/60 group hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:border-primary/30 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2 text-foreground/90">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </motion.div>
      
      {/* Background glowing blob */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[150px] -z-10 pointer-events-none" 
      />
    </section>
  );
}
