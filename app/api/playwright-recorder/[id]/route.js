import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import TestCase from '../../models/TestCase'; // Adjust the path as needed

// This is the API route handler for fetching test cases
export async function GET(request) {
  try {
    // Extract the websiteId and url query parameters from the URL
    const url = new URL(request.url);
    const websiteId = url.searchParams.get('websiteId'); // Get websiteId from query
    const websiteUrl = url.searchParams.get('url'); // Get the URL parameter (optional)

    // Check if the websiteId is a valid MongoDB ObjectId
    if (!websiteId || !mongoose.Types.ObjectId.isValid(websiteId)) {
      return NextResponse.json(
        { error: 'Invalid Website ID' },
        { status: 400 }
      );
    }

    // Fetch the test cases from the database that are associated with the websiteId
    const testCases = await TestCase.find({ website: new mongoose.Types.ObjectId(websiteId) });

    // If no test cases are found, return an appropriate message
    if (testCases.length === 0) {
      return NextResponse.json({ message: 'No test cases found for this website' }, { status: 404 });
    }

    // Return the test cases as a JSON response
    return NextResponse.json(testCases);
  } catch (error) {
    console.error('Error fetching test cases:', error);
    return NextResponse.json(
      { error: 'Error fetching test cases' },
      { status: 500 }
    );
  }
}
