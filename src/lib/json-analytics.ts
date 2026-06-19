export interface JsonMetrics {
  totalKeys: number;
  totalObjects: number;
  totalArrays: number;
  maxDepth: number;
  propertyCount: number;
  sizeBytes: number;
  sizeKb: string;
  nestingScore: number;
  typeDistribution: {
    string: number;
    number: number;
    boolean: number;
    null: number;
  };
}

export function analyzeJson(jsonString: string): JsonMetrics {
  let totalKeys = 0;
  let totalObjects = 0;
  let totalArrays = 0;
  let maxDepth = 0;
  let propertyCount = 0;
  const typeDistribution = {
    string: 0,
    number: 0,
    boolean: 0,
    null: 0
  };

  let parsedObj = null;
  try {
    parsedObj = JSON.parse(jsonString);
  } catch (err) {
    // Return empty metrics if invalid
    return {
      totalKeys: 0,
      totalObjects: 0,
      totalArrays: 0,
      maxDepth: 0,
      propertyCount: 0,
      sizeBytes: 0,
      sizeKb: "0.00",
      nestingScore: 0,
      typeDistribution
    };
  }

  const MAX_DEPTH = 500;

  function traverse(obj: any, depth: number) {
    if (depth > maxDepth) maxDepth = depth;
    if (depth > MAX_DEPTH) return; // Prevent call stack size exceeded DOS

    if (Array.isArray(obj)) {
      totalArrays++;
      for (const item of obj) {
        traverse(item, depth + 1);
      }
    } else if (obj !== null && typeof obj === 'object') {
      totalObjects++;
      const keys = Object.keys(obj);
      totalKeys += keys.length;
      for (const key of keys) {
        traverse(obj[key], depth + 1);
      }
    } else {
      propertyCount++;
      if (obj === null) {
        typeDistribution.null++;
      } else if (typeof obj === 'string') {
        typeDistribution.string++;
      } else if (typeof obj === 'number') {
        typeDistribution.number++;
      } else if (typeof obj === 'boolean') {
        typeDistribution.boolean++;
      }
    }
  }

  if (parsedObj !== null && typeof parsedObj === 'object') {
    traverse(parsedObj, 1);
  } else {
    propertyCount = 1;
    if (parsedObj === null) {
      typeDistribution.null++;
    } else if (typeof parsedObj === 'string') {
      typeDistribution.string++;
    } else if (typeof parsedObj === 'number') {
      typeDistribution.number++;
    } else if (typeof parsedObj === 'boolean') {
      typeDistribution.boolean++;
    }
  }

  const sizeBytes = new Blob([jsonString]).size;
  const sizeKb = (sizeBytes / 1024).toFixed(2);
  
  // Calculate a mock nesting score based on depth (max 10 for 100%, cap at 100)
  const nestingScore = Math.min(Math.round((maxDepth / 10) * 100), 100);

  return {
    totalKeys,
    totalObjects,
    totalArrays,
    maxDepth,
    propertyCount,
    sizeBytes,
    sizeKb,
    nestingScore,
    typeDistribution
  };
}
