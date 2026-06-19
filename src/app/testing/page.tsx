import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { TestingDashboard } from './TestingDashboard';

export default function TestingPage() {
  // Security constraint: Development mode only
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const testDataDir = path.join(process.cwd(), 'test-data');

  const files = [
    'small-valid.json',
    'medium-valid.json',
    'large-valid.json',
    'invalid-syntax.json',
    'deep-nested.json',
    'analytics-test.json'
  ];

  const fileData: Record<string, string> = {};

  try {
    for (const file of files) {
      const filePath = path.join(testDataDir, file);
      if (fs.existsSync(filePath)) {
        fileData[file] = fs.readFileSync(filePath, 'utf-8');
      } else {
        fileData[file] = `Error: File not found at ${filePath}`;
      }
    }
  } catch (err) {
    console.error("Error reading test data", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TestingDashboard initialData={fileData} />
    </div>
  );
}
