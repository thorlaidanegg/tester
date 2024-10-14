import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import TestRunHistory from '@/models/TestRunHistory';
import connectMongo from '@/lib/db';

// GET route - Get all test run histories
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Fetch all test run histories
    const testRunHistories = await TestRunHistory.find().populate('testCase');

    return NextResponse.json(testRunHistories);
  } catch (error) {
    console.error('Error fetching test run histories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST route - Add a new test run history
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();

    // Destructure fields from the body
    const { testCase, status, errorMessage, videoUrl, executionTime, scheduledRun } = body;

    // Validate required fields
    if (!testCase || !status) {
      return NextResponse.json({ error: 'Test case and status are required' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Create a new test run history entry
    const newTestRunHistory = new TestRunHistory({
      testCase,
      status,
      errorMessage,
      videoUrl,
      executionTime,
      scheduledRun,
    });

    // Save the entry to the database
    await newTestRunHistory.save();

    return NextResponse.json({ message: 'Test run history added successfully' });
  } catch (error) {
    console.error('Error adding test run history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
