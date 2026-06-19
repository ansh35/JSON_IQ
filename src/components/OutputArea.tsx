import { Check, Copy, Settings2, AlertCircle, Download, Activity, ListTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { analyzeJson } from "@/lib/json-analytics";
import { JsonTree } from "@/components/JsonTree";

interface OutputAreaProps {
  value: string;
  error: string | null;
  mode: 'format' | 'minify' | 'ai' | 'analytics' | 'ts' | 'tree';
  onModeChange: (mode: 'format' | 'minify' | 'ai' | 'analytics' | 'ts' | 'tree') => void;
  isLoading?: boolean;
  rawInput?: string;
}

export function OutputArea({ value, error, mode, onModeChange, isLoading, rawInput = "" }: OutputAreaProps) {
  const [copied, setCopied] = useState(false);

  const metrics = useMemo(() => {
    if (mode !== 'analytics' || !rawInput || error) return null;
    return analyzeJson(rawInput);
  }, [mode, rawInput, error]);

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (value && !error) {
      const blob = new Blob([value], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `output-${mode}.${mode === 'ts' ? 'ts' : 'json'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`${mode === 'ts' ? 'TypeScript' : 'JSON'} downloaded successfully`);
    }
  };

  return (
    <div className="glass-panel flex flex-col h-full overflow-hidden border border-white/5 hover:border-primary/30 transition-colors shadow-lg relative group rounded-[1.5rem]">
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-30 flex items-center justify-center rounded-[1.5rem]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between px-5 py-4 border-b border-white/5 bg-black/40 backdrop-blur-sm gap-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <Settings2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-wide text-foreground/90 uppercase">Output & Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/5 text-xs font-medium gap-1.5 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-white/10 transition-all"
            onClick={handleDownload}
            disabled={!value || !!error}
            title="Download JSON"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/5 text-xs font-medium gap-1.5 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-white/10 transition-all"
            onClick={handleCopy}
            disabled={!value || !!error}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col p-4 min-h-0">
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2 shrink-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Button 
            size="sm" 
            variant={mode === 'format' ? 'secondary' : 'ghost'} 
            className={`h-7 text-xs px-3 rounded-full ${mode !== 'format' ? 'text-muted-foreground' : ''}`}
            onClick={() => onModeChange('format')}
          >
            Formatted
          </Button>
          <Button 
            size="sm" 
            variant={mode === 'minify' ? 'secondary' : 'ghost'} 
            className={`h-7 text-xs px-3 rounded-full ${mode !== 'minify' ? 'text-muted-foreground' : ''}`}
            onClick={() => onModeChange('minify')}
          >
            Minified
          </Button>
          <Button 
            size="sm" 
            variant={mode === 'tree' ? 'secondary' : 'ghost'} 
            className={`h-7 text-xs px-3 rounded-full ${mode !== 'tree' ? 'text-muted-foreground' : ''}`}
            onClick={() => onModeChange('tree')}
          >
            <ListTree className="w-3.5 h-3.5 mr-1 inline" /> Tree View
          </Button>
          <Button 
            size="sm" 
            variant={mode === 'ts' ? 'secondary' : 'ghost'} 
            className={`h-7 text-xs px-3 rounded-full ${mode !== 'ts' ? 'text-muted-foreground' : ''}`}
            onClick={() => onModeChange('ts')}
          >
            Generate TS
          </Button>
          <Button 
            size="sm" 
            variant={mode === 'ai' ? 'secondary' : 'ghost'} 
            className={`h-7 text-xs px-3 rounded-full ${mode !== 'ai' ? 'text-muted-foreground' : ''}`}
            onClick={() => onModeChange('ai')}
          >
            AI Insights
          </Button>
          <Button 
            size="sm" 
            variant={mode === 'analytics' ? 'secondary' : 'ghost'} 
            className={`h-7 text-xs px-3 rounded-full ${mode !== 'analytics' ? 'text-muted-foreground' : ''}`}
            onClick={() => onModeChange('analytics')}
          >
            <Activity className="w-3.5 h-3.5 mr-1 inline" /> Analytics
          </Button>
        </div>
        
        {mode === 'analytics' ? (
          <ScrollArea className="flex-1 bg-black/20 border rounded-lg p-6 border-white/5">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground mt-20">
                <AlertCircle className="w-8 h-8 mb-4 text-red-500/50" />
                <p>Please fix JSON syntax errors to view analytics.</p>
              </div>
            ) : metrics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Total Keys</p>
                    <p className="text-2xl font-semibold">{metrics.totalKeys}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Total Objects</p>
                    <p className="text-2xl font-semibold">{metrics.totalObjects}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Total Arrays</p>
                    <p className="text-2xl font-semibold">{metrics.totalArrays}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Max Depth</p>
                    <p className="text-2xl font-semibold">{metrics.maxDepth}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-xs text-muted-foreground">JSON Size</p>
                      <p className="text-xs font-mono">{metrics.sizeKb} KB</p>
                    </div>
                    <p className="text-2xl font-semibold mb-4">{metrics.sizeBytes} <span className="text-sm font-normal text-muted-foreground">bytes</span></p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Terminal Properties</p>
                    <p className="text-2xl font-semibold mb-4">{metrics.propertyCount}</p>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium">Nesting Complexity Score</h4>
                    <span className="text-sm font-bold text-primary">{metrics.nestingScore}/100</span>
                  </div>
                  <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${metrics.nestingScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Higher scores indicate deeply nested structures which may be harder to maintain or parse efficiently.
                  </p>
                </div>

                {metrics.typeDistribution && (metrics.typeDistribution.string > 0 || metrics.typeDistribution.number > 0 || metrics.typeDistribution.boolean > 0 || metrics.typeDistribution.null > 0) && (
                  <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                    <h4 className="text-sm font-medium mb-4">Data Type Distribution</h4>
                    <div className="flex w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 mb-4">
                      {(() => {
                        const total = metrics.typeDistribution.string + metrics.typeDistribution.number + metrics.typeDistribution.boolean + metrics.typeDistribution.null;
                        const pString = (metrics.typeDistribution.string / total) * 100;
                        const pNumber = (metrics.typeDistribution.number / total) * 100;
                        const pBool = (metrics.typeDistribution.boolean / total) * 100;
                        const pNull = (metrics.typeDistribution.null / total) * 100;
                        return (
                          <>
                            {pString > 0 && <div style={{ width: `${pString}%` }} className="h-full bg-emerald-500 transition-all duration-1000" title={`String: ${metrics.typeDistribution.string}`} />}
                            {pNumber > 0 && <div style={{ width: `${pNumber}%` }} className="h-full bg-blue-500 transition-all duration-1000" title={`Number: ${metrics.typeDistribution.number}`} />}
                            {pBool > 0 && <div style={{ width: `${pBool}%` }} className="h-full bg-amber-500 transition-all duration-1000" title={`Boolean: ${metrics.typeDistribution.boolean}`} />}
                            {pNull > 0 && <div style={{ width: `${pNull}%` }} className="h-full bg-rose-500 transition-all duration-1000" title={`Null: ${metrics.typeDistribution.null}`} />}
                          </>
                        );
                      })()}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> String: {metrics.typeDistribution.string}</div>
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Number: {metrics.typeDistribution.number}</div>
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Boolean: {metrics.typeDistribution.boolean}</div>
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Null: {metrics.typeDistribution.null}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </ScrollArea>
        ) : mode === 'tree' ? (
          <ScrollArea className={`flex-1 bg-black/20 border rounded-lg p-6 font-mono text-sm ${error ? 'border-red-500/50' : 'border-white/5'}`}>
            {error ? (
              <div>
                <div className="text-red-400 flex items-center gap-2 mb-2 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> Invalid JSON
                </div>
                <pre className="text-red-400 whitespace-pre-wrap font-mono text-xs mt-4">
                  {error}
                </pre>
              </div>
            ) : (
              <div>
                <div className="text-green-400 flex items-center gap-2 mb-4 text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" /> Interactive Tree View
                </div>
                {rawInput ? (
                  (() => {
                    try {
                      return <JsonTree data={JSON.parse(rawInput)} />;
                    } catch (e) {
                      return <span className="text-muted-foreground">Parsing JSON...</span>;
                    }
                  })()
                ) : (
                  <span className="text-muted-foreground">No data to display.</span>
                )}
              </div>
            )}
          </ScrollArea>
        ) : (
          <ScrollArea className={`flex-1 bg-black/20 border rounded-lg p-4 font-mono text-sm ${error ? 'border-red-500/50' : 'border-white/5'}`}>
            {error ? (
              <div>
                <div className="text-red-400 flex items-center gap-2 mb-2 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> Invalid JSON
                </div>
                <pre className="text-red-400 whitespace-pre-wrap font-mono text-xs mt-4">
                  {error}
                </pre>
              </div>
            ) : (
              <div>
                {value && !value.startsWith('**AI Request Failed**') && (
                  <div className="text-green-400 flex items-center gap-2 mb-2 text-xs font-semibold">
                    <Check className="w-3.5 h-3.5" /> Valid JSON
                  </div>
                )}
                {value && value.startsWith('**AI Request Failed**') && (
                  <div className="text-red-400 flex items-center gap-2 mb-2 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> AI Analysis Failed
                  </div>
                )}
                <pre className={`${value?.startsWith('**AI Request Failed**') ? 'text-red-400/90' : 'text-muted-foreground'} whitespace-pre-wrap break-all`}>
                  <code>{value?.replace('**AI Request Failed**\n', '')}</code>
                </pre>
              </div>
            )}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
