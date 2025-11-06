import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password, name, role } = body;

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!['client'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Public signup allows only client accounts.' },
        { status: 400 }
      );
    }

    // Block owner account creation from public signup API
    if (role === 'owner') {
      return NextResponse.json(
        { error: 'Owner accounts cannot be created via public signup.' },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    // Generate token
    const token = generateToken({
      userId: String((user as any)._id),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        token,
        user: {
          id: String((user as any)._id),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
