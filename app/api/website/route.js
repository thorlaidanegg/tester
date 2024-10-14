import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import User from '@/models/User';
import Website from '@/models/Website';
import connectMongo from '@/lib/db';

// GET route - Get user details and all associated websites
export async function GET() {
  try {
    // Get the session
    const session = await auth();

    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    console.log(session.user.email);

    // Fetch user details along with associated websites using populate()
    const user = await User.findOne({ email: session.user.email }).populate('websites');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user and websites
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST route - Add a new website for the user
export async function POST(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, url } = await request.json();

    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create a new website document
    const newWebsite = new Website({ name, url, user: user._id });

    // Save the new website to the database
    await newWebsite.save();

    // Add the website to the user's websites array
    user.websites.push(newWebsite._id);
    await user.save();

    return NextResponse.json({ message: 'Website added successfully', website: newWebsite });
  } catch (error) {
    console.error('Error adding website:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE route - Delete a website by ID
// DELETE /api/websites
export async function DELETE(req) {
  try {
    // Parse the request body to get the ID
    const { id } = await req.json();

    // Validate that the ID is provided
    if (!id) {
      return NextResponse.json({ error: 'Website ID is required' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Delete the website by ID
    const deletedWebsite = await Website.findByIdAndDelete(id);

    if (!deletedWebsite) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Website deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting website:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
