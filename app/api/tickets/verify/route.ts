import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload || payload.role !== 'client') {
      return NextResponse.json(
        { error: 'Unauthorized - Client access only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { ticketId } = body;

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    // Find ticket
    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check if already entered
    if (ticket.hasEntered) {
      return NextResponse.json(
        {
          error: 'Ticket already used',
          entryTime: ticket.entryTime,
        },
        { status: 400 }
      );
    }

    // Mark as entered
    ticket.hasEntered = true;
    ticket.entryTime = new Date();
    await ticket.save();

    return NextResponse.json({
      message: 'Entry verified successfully',
      ticket: {
        ticketId: ticket.ticketId,
        customerName: ticket.customerName,
        eventName: ticket.eventName,
        entryTime: ticket.entryTime,
      },
    });
  } catch (error: any) {
    console.error('Ticket verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
