import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';

let recordingProcess = null;

export async function GET(request) {
  try {
    const url = new URL(request.url).searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const outputFilePath = path.join(process.cwd(), 'playwright-recordings', `test-${Date.now()}.spec.ts`);

    // Start Playwright codegen
    recordingProcess = exec(`npx playwright codegen ${url} --output ${outputFilePath}`);

    // Return response indicating recording has started
    return NextResponse.json({ message: 'Recording started', outputFilePath }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start recording' }, { status: 500 });
  }
}
