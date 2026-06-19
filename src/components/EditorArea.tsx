import { FileJson, Upload, Trash2, ClipboardPaste, Beaker, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

interface EditorAreaProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export function EditorArea({ value, onChange, onClear }: EditorAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [testFiles, setTestFiles] = useState<string[]>([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [minimapEnabled, setMinimapEnabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetch('/api/test-data')
      .then(res => res.json())
      .then(data => {
        if (data.files) {
          setTestFiles(data.files);
        }
      })
      .catch(err => console.error("Failed to load test files", err));
  }, []);

  const handleLoadTestFile = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const file = e.target.value;
    if (!file) return;
    
    setIsLoadingFile(true);
    try {
      const res = await fetch(`/api/test-data?file=${encodeURIComponent(file)}`);
      const data = await res.json();
      if (data.content) {
        onChange(data.content);
        toast.success(`Loaded ${file}`);
      } else {
        toast.error("Failed to load file content");
      }
    } catch (err) {
      toast.error("Error loading test file");
    } finally {
      setIsLoadingFile(false);
      e.target.value = ""; 
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        toast.success("Pasted from clipboard");
      }
    } catch (err) {
      toast.error("Failed to read clipboard");
    }
  };

  const processFile = (file: File) => {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      toast.error("Please provide a valid JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onChange(content);
      toast.success(`Loaded ${file.name}`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = () => {
    onClear();
    toast.success("Editor cleared");
  };

  const toggleSettings = () => {
    setMinimapEnabled(!minimapEnabled);
    toast.info(`Minimap ${!minimapEnabled ? 'Enabled' : 'Disabled'}`);
  };

  const byteSize = new Blob([value]).size;
  const isOverLimit = byteSize > 15 * 1024;

  return (
    <div 
      className={`glass-panel flex flex-col h-full overflow-hidden border transition-all shadow-lg relative group rounded-[1.5rem] ${isDragging ? 'border-primary bg-primary/10' : 'border-white/5 hover:border-primary/30'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-primary">
          <Upload className="w-12 h-12 text-primary mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-2">Drop JSON File Here</h3>
          <p className="text-muted-foreground">Release to instantly load contents into the editor</p>
        </div>
      )}

      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between px-5 py-4 border-b border-white/5 bg-black/40 backdrop-blur-sm gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <FileJson className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-wide text-foreground/90 uppercase">Input JSON</span>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept=".json,application/json" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/5 text-xs font-medium gap-1.5 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-white/10 transition-all"
            onClick={() => fileInputRef.current?.click()}
            title="Upload JSON File"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/5 text-xs font-medium gap-1.5 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-white/10 transition-all"
            onClick={handlePaste}
            title="Paste JSON"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-lg bg-white/5 border border-white/5 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all ml-1"
            onClick={handleClear}
            title="Clear Editor"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 min-h-0">
        {isOverLimit && (
          <div className="mb-4 p-3 rounded-lg border border-orange-500/50 bg-orange-500/10 flex items-start gap-3 shadow-[0_0_15px_rgba(249,115,22,0.15)] animate-in slide-in-from-top-2 fade-in duration-300">
            <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-orange-400">15KB Free Tier Exceeded</h4>
              <p className="text-xs text-orange-400/80 mt-1">This JSON payload is {(byteSize / 1024).toFixed(1)}KB. The free tier is limited to payloads under 15KB. AI Insights and advanced formatting features may be disabled.</p>
            </div>
          </div>
        )}
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2 shrink-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {testFiles.length > 0 && (
            <div className="relative mr-2">
              <select 
                className="appearance-none bg-black/60 border border-white/10 rounded-lg pl-8 pr-8 py-1.5 h-7 text-xs font-medium text-muted-foreground hover:text-white hover:border-primary/50 transition-all outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50"
                onChange={handleLoadTestFile}
                defaultValue=""
                disabled={isLoadingFile}
              >
                <option value="" disabled>Load Sample...</option>
                {testFiles.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <Beaker className="w-3.5 h-3.5" />
              </div>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          )}

          <Button 
            size="sm" 
            variant={minimapEnabled ? 'secondary' : 'ghost'} 
            className={`h-7 text-xs px-3 rounded-full ${!minimapEnabled ? 'text-muted-foreground' : ''}`}
            onClick={toggleSettings}
            title="Toggle Minimap"
          >
            Map: {minimapEnabled ? 'ON' : 'OFF'}
          </Button>
        </div>

        <div className="flex-1 relative w-full h-full min-h-[400px] border border-white/5 rounded-lg overflow-hidden shadow-inner bg-[#1e1e1e]">
          <div className="absolute inset-0">
            <Editor
              height="100%"
              width="100%"
              language="json"
              value={value}
              onChange={(val) => onChange(val || "")}
              theme="vs-dark"
              options={{
                automaticLayout: true,
                minimap: { enabled: minimapEnabled },
                fontSize: 14,
                wordWrap: "on",
                formatOnPaste: true,
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: "all",
                contextmenu: true,
                fontFamily: "monospace",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
