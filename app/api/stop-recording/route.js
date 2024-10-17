import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import TestCase from '@/models/TestCase'; // Import your TestCase model
import Website from '@/models/Website'; // Import your Website model if needed

export async function POST(request) {
  try {
    const { websiteName, websiteUrl, websiteId } = await request.json();

    // Validate incoming data
    if (!websiteName || !websiteUrl || !websiteId) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Path to the Playwright recordings directory
    const recordingsDir = path.join(process.cwd(), 'playwright-recordings');

    // Ensure the directory exists
    const dirExists = await fs.access(recordingsDir).then(() => true).catch(() => false);
    if (!dirExists) {
      return NextResponse.json({ error: 'Recordings directory not found' }, { status: 404 });
    }

    // Get the most recent .spec.js file
    const files = await fs.readdir(recordingsDir);
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

    // Save the script to MongoDB
    const newTestCase = new TestCase({
      name: `Test Case - ${websiteName}`,
      script: testScript,
      website: websiteId, // The ID of the associated website
    });

    await newTestCase.save();

    // Optionally, delete the test script file after saving
    await fs.unlink(outputFilePath);

    return NextResponse.json({ script: newTestCase.script, message: 'Recording stopped and saved' }, { status: 200 });

  } catch (error) {
    console.error('Error stopping recording:', error);
    return NextResponse.json({ error: 'Failed to stop recording and save the script' }, { status: 500 });
  }
}
