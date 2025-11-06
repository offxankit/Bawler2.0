import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    await connectDB();

    const { ticketId } = params;

    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ticket: {
        ticketId: ticket.ticketId,
        customerName: ticket.customerName,
        customerPhone: ticket.customerPhone,
        customerEmail: ticket.customerEmail,
        eventName: ticket.eventName,
        eventDate: ticket.eventDate,
        additionalDetails: ticket.additionalDetails,
        qrCode: ticket.qrCode,
        hasEntered: ticket.hasEntered,
        entryTime: ticket.entryTime,
      },
    });
  } catch (error: any) {
    console.error('Ticket fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
