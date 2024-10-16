import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import TestCase from '@/models/TestCase';
import Website from '@/models/Website';
import connectMongo from '@/lib/db';
import mongoose from 'mongoose';

// GET route - Get all test cases for a specific website
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const websiteId = request.nextUrl.searchParams.get('websiteId');
    if (!websiteId) {
      return NextResponse.json({ error: 'Website ID is required' }, { status: 400 });
    }

    // Validate if websiteId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(websiteId)) {
      return NextResponse.json({ error: 'Invalid Website ID format' }, { status: 400 });
    }

    await connectMongo();

    const testCases = await TestCase.find({ website: websiteId }).populate('website');
    return NextResponse.json(testCases);
  } catch (error) {
    console.error('Error fetching test cases:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST route - Add a new test case
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, script, websiteId } = await request.json();
    if (!name || !script || !websiteId) {
      return NextResponse.json({ error: 'Name, script, and websiteId are required' }, { status: 400 });
    }

    // Validate if websiteId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(websiteId)) {
      return NextResponse.json({ error: 'Invalid Website ID format' }, { status: 400 });
    }

    await connectMongo();

    const newTestCase = new TestCase({ name, script, website: websiteId });
    await newTestCase.save();

    return NextResponse.json({ message: 'Test case added successfully', testCase: newTestCase });
  } catch (error) {
    console.error('Error adding test case:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE route - Delete a test case by ID
export async function DELETE(request) {
  try {
    const { id, websiteId } = await request.json();
    if (!id || !websiteId) {
      return NextResponse.json({ error: 'Test case ID and websiteId are required' }, { status: 400 });
    }

    // Validate if websiteId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(websiteId)) {
      return NextResponse.json({ error: 'Invalid Website ID format' }, { status: 400 });
    }

    await connectMongo();

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
