'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { analyzeJson, JsonMetrics } from "@/lib/json-analytics";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Play, FileJson, AlertTriangle, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TestingDashboardProps {
  initialData: Record<string, string>;
}

export function TestingDashboard({ initialData }: TestingDashboardProps) {
  const [selectedFile, setSelectedFile] = useState<string>("small-valid.json");
  const [activeData, setActiveData] = useState<string>("");
  const [metrics, setMetrics] = useState<JsonMetrics | null>(null);
  const [validationResult, setValidationResult] = useState<{ pass: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoadData = () => {
    const data = initialData[selectedFile];
    setActiveData(data);
    setMetrics(null);
    setValidationResult(null);
    setError(null);
  };

  const handleRunValidation = () => {
    if (!activeData) return;
    
    let isSyntaxError = false;
    let computedMetrics: JsonMetrics | null = null;
    
    try {
      JSON.parse(activeData);
      computedMetrics = analyzeJson(activeData);
      setMetrics(computedMetrics);
      setError(null);
    } catch (err: any) {
      isSyntaxError = true;
      setError(err.message);
      setMetrics(null);
    }

    // Pass/Fail Logic
    if (selectedFile === "invalid-syntax.json") {
      if (isSyntaxError) {
        setValidationResult({ pass: true, message: "Correctly identified syntax errors." });
      } else {
        setValidationResult({ pass: false, message: "Failed to identify invalid syntax." });
      }
    } else if (selectedFile === "analytics-test.json") {
      if (!isSyntaxError && computedMetrics) {
        const pass = computedMetrics.totalKeys === 50 && 
                     computedMetrics.totalObjects === 10 && 
                     computedMetrics.totalArrays === 5;
        if (pass) {
          setValidationResult({ pass: true, message: "Analytics exact counts matched expected values (50 Keys, 10 Objects, 5 Arrays)." });
        } else {
          setValidationResult({ 
            pass: false, 
            message: `Count mismatch. Found: ${computedMetrics.totalKeys} keys, ${computedMetrics.totalObjects} objects, ${computedMetrics.totalArrays} arrays.`
          });
        }
      } else {
        setValidationResult({ pass: false, message: "Syntax error on valid file." });
      }
    } else {
      // General valid files
      if (!isSyntaxError) {
        setValidationResult({ pass: true, message: "File parsed and analyzed successfully." });
      } else {
        setValidationResult({ pass: false, message: "Valid file threw a syntax error." });
      }
    }
  };

  const fileOptions = Object.keys(initialData);

  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.7)] transition-shadow duration-300">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-sm tracking-tight text-white">JSON-IQ</span>
              </div>
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>Internal QA Dashboard</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-8">Test Data Validation</h1>

          <div className="glass-panel p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-end gap-4 border border-white/10">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Select Test File</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none"
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
              >
                {fileOptions.map(file => (
                  <option key={file} value={file}>{file}</option>
                ))}
              </select>
            </div>
            <Button onClick={handleLoadData} variant="outline" className="h-11 px-6 glass w-full sm:w-auto">
              <FileJson className="w-4 h-4 mr-2" /> Load Test Data
            </Button>
            <Button onClick={handleRunValidation} className="h-11 px-6 w-full sm:w-auto bg-primary text-primary-foreground shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Play className="w-4 h-4 mr-2" /> Run Automated Validation
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
              <h3 className="font-semibold mb-4 text-lg">Raw Data Preview</h3>
              <ScrollArea className="flex-1 h-[400px] bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-xs text-muted-foreground whitespace-pre">
                {activeData || "No data loaded. Please select a file and load."}
              </ScrollArea>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
              <h3 className="font-semibold text-lg">Test Results</h3>
              
              {validationResult ? (
                <div className={`p-4 rounded-xl flex items-start gap-3 border ${validationResult.pass ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  {validationResult.pass ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                  <div>
                    <h4 className={`font-semibold ${validationResult.pass ? 'text-green-500' : 'text-red-500'}`}>
                      {validationResult.pass ? 'TEST PASSED' : 'TEST FAILED'}
                    </h4>
                    <p className="text-sm mt-1 text-muted-foreground">{validationResult.message}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center text-sm text-muted-foreground">
                  Run validation to see results.
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <h4 className="font-semibold text-red-500 text-sm mb-1">Parser Output</h4>
                  <p className="text-xs font-mono text-red-400">{error}</p>
                </div>
              )}

              {metrics && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground">JSON Size</p>
                    <p className="text-xl font-semibold mt-1">{metrics.sizeKb} KB</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground">Total Keys</p>
                    <p className="text-xl font-semibold mt-1">{metrics.totalKeys}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground">Total Objects</p>
                    <p className="text-xl font-semibold mt-1">{metrics.totalObjects}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground">Total Arrays</p>
                    <p className="text-xl font-semibold mt-1">{metrics.totalArrays}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground">Max Depth</p>
                    <p className="text-xl font-semibold mt-1">{metrics.maxDepth}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground">Terminal Props</p>
                    <p className="text-xl font-semibold mt-1">{metrics.propertyCount}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
