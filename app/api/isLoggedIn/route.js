import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the session
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({status: false}, { status: 200 });
    }

    return NextResponse.json({status: true}, { status: 200 });


  }catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}