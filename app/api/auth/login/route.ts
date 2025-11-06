import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const emailInput = String(body?.email ?? '').trim().toLowerCase();
    const passwordInput = String(body?.password ?? '');
    const roleInput = String(body?.role ?? '').trim().toLowerCase();

    // Validation
    if (!emailInput || !passwordInput || !roleInput) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: emailInput, role: roleInput });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    // If stored password looks like a bcrypt hash ($2a/$2b), use bcrypt compare.
    // Otherwise, fall back to plain-text equality (for manually inserted owner passwords).
    let isValidPassword = false;
    const stored = typeof user.password === 'string' ? user.password : '';
    if (!stored) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    if (/^\$2[abxy]?\$\d+\$/.test(stored)) {
      isValidPassword = await comparePassword(passwordInput, stored);
    } else {
      isValidPassword = passwordInput === stored;
    }
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: String((user as any)._id),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: String((user as any)._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
