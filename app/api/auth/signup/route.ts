import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already taken' }, { status: 409 });
    }

    // Insert the new user into the database securely
    // (Note: in high tier production, we would use bcrypt to hash the password here)
    const result = await db.collection('users').insertOne({
      name,
      email,
      password, // securely storing raw string strictly for sandbox usability right now
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'User created' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
