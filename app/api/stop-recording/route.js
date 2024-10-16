import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs'; // Ensure you have a mongoose connection file
import TestCase from '@/models/TestCase';
import connectMongo from '@/lib/db';


export async function GET(request) {
  try {
    await connectMongo(); // Ensure the DB connection is established

    // Path to where the Playwright test script would be saved
    const outputFilePath = path.join(process.cwd(), 'playwright-recordings', `test-${Date.now()}.spec.ts`);

    // If no recording process exists, return error
    if (!recordingProcess) {
      return NextResponse.json({ error: 'No active recording process' }, { status: 400 });
    }

    // Kill the Playwright process to stop recording
    recordingProcess.kill('SIGINT');
    recordingProcess = null; // Reset the process to null

    // Read the generated script from the file
    const testScript = fs.readFileSync(outputFilePath, 'utf-8');

    // Save the script to MongoDB
    const newTestCase = new TestCase({
      name: `Test Case - ${Date.now()}`,
      script: testScript,  // Save the script content directly
      website: '670cf0dbef03e1ca43c3f784', // Replace with your website ID
    });

    await newTestCase.save();

    // Clean up by deleting the temporary test script file (optional)
    fs.unlinkSync(outputFilePath);

    // Return the saved test case to the frontend
    return NextResponse.json({ script: testScript, message: 'Recording stopped and saved' }, { status: 200 });
  } catch (error) {
    console.error('Error stopping recording:', error);
    return NextResponse.json({ error: 'Failed to stop recording and save the script' }, { status: 500 });
  }
}
