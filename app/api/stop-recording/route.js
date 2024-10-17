import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
  try {
    // Path to the Playwright recordings directory
    const recordingsDir = path.join(process.cwd(), 'playwright-recordings');

    // Ensure the directory exists
    const dirExists = await fs.access(recordingsDir).then(() => true).catch(() => false);
    if (!dirExists) {
      return NextResponse.json({ error: 'Recordings directory not found' }, { status: 404 });
    }

    // Get the list of test files
    const files = await fs.readdir(recordingsDir);

    // Filter for '.spec.js' files and sort them by modification time
    const mostRecentFile = (
      await Promise.all(
        files
          .filter(file => file.endsWith('.spec.js'))
          .map(async file => ({
            file,
            mtime: (await fs.stat(path.join(recordingsDir, file))).mtime.getTime(),
          }))
      )
    ).sort((a, b) => b.mtime - a.mtime)[0]?.file;

    if (!mostRecentFile) {
      return NextResponse.json({ error: 'No recorded test found' }, { status: 404 });
    }

    const outputFilePath = path.join(recordingsDir, mostRecentFile);

    // Read the content of the most recent test file
    const testScript = await fs.readFile(outputFilePath, 'utf-8');

    // Save the script to MongoDB (assuming you have the MongoDB logic here)
    const newTestCase = {
      name: `Test Case - ${Date.now()}`,
      script: testScript,
      website: '670cf0dbef03e1ca43c3f784', // Replace with your website ID
    };

    // Optionally, clean up by deleting the test script file
    await fs.unlink(outputFilePath);

    // Return the saved test case to the frontend
    return NextResponse.json({ script: newTestCase, message: 'Recording stopped and saved' }, { status: 200 });

  } catch (error) {
    console.error('Error stopping recording:', error);
    return NextResponse.json({ error: 'Failed to stop recording and save the script' }, { status: 500 });
  }
}
