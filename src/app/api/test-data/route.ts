import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('file');

  const testDataDir = path.join(process.cwd(), 'test-data');

  try {
    if (fileName) {
      // Secure the file path to prevent directory traversal
      const safeFileName = path.basename(fileName);
      const filePath = path.join(testDataDir, safeFileName);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json({ content });
      } else {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
    } else {
      // Return list of files
      if (fs.existsSync(testDataDir)) {
        const files = fs.readdirSync(testDataDir).filter(f => f.endsWith('.json'));
        return NextResponse.json({ files });
      } else {
        return NextResponse.json({ files: [] });
      }
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
