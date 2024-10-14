import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import TestCase from '@/models/TestCase';
import Website from '@/models/Website';
import connectMongo from '@/lib/db';

// GET route - Get all test cases
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Fetch all test cases
    const testCases = await TestCase.find().populate('website');

    return NextResponse.json(testCases);
  } catch (error) {
    console.error('Error fetching test cases:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST route - Add a new test case
// POST route - Add a new test case
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, script, websiteId } = await request.json(); // Updated to get websiteId
    if (!name || !script || !websiteId) {
      return NextResponse.json({ error: 'Name, script, and websiteId are required' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Create a new test case document
    const newTestCase = new TestCase({ name, script, website: websiteId });
    await newTestCase.save();

    return NextResponse.json({ message: 'Test case added successfully', testCase: newTestCase });
  } catch (error) {
    console.error('Error adding test case:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// DELETE route - Delete a test case by ID
// DELETE route - Delete a test case by ID
export async function DELETE(req) {
  try {
    const { id, websiteId } = await req.json(); // Get both id and websiteId from body
    if (!id || !websiteId) {
      return NextResponse.json({ error: 'Test case ID and websiteId are required' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Delete the test case by ID
    const deletedTestCase = await TestCase.findByIdAndDelete(id);
    if (!deletedTestCase) {
      return NextResponse.json({ error: 'Test case not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Test case deleted successfully' });
  } catch (error) {
    console.error('Error deleting test case:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

