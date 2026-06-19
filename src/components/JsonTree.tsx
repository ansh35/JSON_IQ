import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface JsonTreeProps {
  data: JsonValue;
  isLast?: boolean;
  depth?: number;
}

export function JsonTree({ data, isLast = true, depth = 0 }: JsonTreeProps) {
  if (data === null) {
    return <span className="text-muted-foreground font-mono text-sm">null{isLast ? '' : ','}</span>;
  }
  
  if (typeof data === 'string') {
    return <span className="text-green-400 font-mono text-sm">"{data}"{isLast ? '' : ','}</span>;
  }
  
  if (typeof data === 'number') {
    return <span className="text-amber-400 font-mono text-sm">{data}{isLast ? '' : ','}</span>;
  }
  
  if (typeof data === 'boolean') {
    return <span className="text-blue-400 font-mono text-sm">{data ? 'true' : 'false'}{isLast ? '' : ','}</span>;
  }
  
  if (Array.isArray(data)) {
    return <JsonArray data={data} isLast={isLast} depth={depth} />;
  }
  
  if (typeof data === 'object') {
    return <JsonObject data={data as Record<string, JsonValue>} isLast={isLast} depth={depth} />;
  }
  
  return <span className="text-muted-foreground font-mono text-sm">{String(data)}{isLast ? '' : ','}</span>;
}

function JsonArray({ data, isLast, depth }: { data: JsonValue[], isLast: boolean, depth: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  
  if (data.length === 0) {
    return <span className="font-mono text-sm">[]{isLast ? '' : ','}</span>;
  }
  
  if (!expanded) {
    return (
      <span className="font-mono text-sm inline-flex items-center cursor-pointer hover:bg-white/5 rounded px-1 -ml-1 transition-colors" onClick={() => setExpanded(true)}>
        <ChevronRight className="w-3 h-3 text-muted-foreground mr-1" />
        <span className="text-muted-foreground">[{data.length} items]</span>
        {isLast ? '' : ','}
      </span>
    );
  }
  
  return (
    <span className="font-mono text-sm flex flex-col">
      <span className="inline-flex items-center cursor-pointer hover:bg-white/5 rounded px-1 -ml-5 w-fit transition-colors" onClick={() => setExpanded(false)}>
        <ChevronDown className="w-3 h-3 text-muted-foreground mr-1" />
        [
      </span>
      <div className="pl-4 border-l border-white/10 ml-2 py-1 flex flex-col">
        {data.map((item, index) => (
          <div key={index} className="flex">
            <JsonTree data={item} isLast={index === data.length - 1} depth={depth + 1} />
          </div>
        ))}
      </div>
      <span>]{isLast ? '' : ','}</span>
    </span>
  );
}

function JsonObject({ data, isLast, depth }: { data: Record<string, JsonValue>, isLast: boolean, depth: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const keys = Object.keys(data);
  
  if (keys.length === 0) {
    return <span className="font-mono text-sm">{'{'}{'}'}{isLast ? '' : ','}</span>;
  }
  
  if (!expanded) {
    return (
      <span className="font-mono text-sm inline-flex items-center cursor-pointer hover:bg-white/5 rounded px-1 -ml-1 transition-colors" onClick={() => setExpanded(true)}>
        <ChevronRight className="w-3 h-3 text-muted-foreground mr-1" />
        <span className="text-muted-foreground">{'{'}{keys.length} keys{'}'}</span>
        {isLast ? '' : ','}
      </span>
    );
  }
  
  return (
    <span className="font-mono text-sm flex flex-col">
      <span className="inline-flex items-center cursor-pointer hover:bg-white/5 rounded px-1 -ml-5 w-fit transition-colors" onClick={() => setExpanded(false)}>
        <ChevronDown className="w-3 h-3 text-muted-foreground mr-1" />
        {'{'}
      </span>
      <div className="pl-4 border-l border-white/10 ml-2 py-1 flex flex-col">
        {keys.map((key, index) => (
          <div key={key} className="flex flex-wrap break-all items-start">
            <span className="text-fuchsia-400 font-medium mr-2">"{key}":</span>
            <JsonTree data={data[key]} isLast={index === keys.length - 1} depth={depth + 1} />
          </div>
        ))}
      </div>
      <span>{'}'}{isLast ? '' : ','}</span>
    </span>
  );
}
