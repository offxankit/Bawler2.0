import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { verifyToken } from '@/lib/auth';
import { generateTicketId, isValidE164 } from '@/lib/utils';
import QRCode from 'qrcode';

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

    if (!payload || payload.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized - Owner access only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      eventName,
      eventDate,
      additionalDetails,
    } = body;

    // Validation
    if (!customerName || !customerPhone || !eventName) {
      return NextResponse.json(
        { error: 'Customer name, phone, and event name are required' },
        { status: 400 }
      );
    }

    // Phone format validation (E.164)
    if (!isValidE164(customerPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use E.164 format, e.g., +14155552671 or +919876543210' },
        { status: 400 }
      );
    }

    // Generate unique ticket ID
    const ticketId = generateTicketId();

    // Generate QR code
    const qrCodeData = JSON.stringify({
      ticketId,
      customerName,
      eventName,
    });
    const qrCode = await QRCode.toDataURL(qrCodeData);

    // Create ticket
    const ticket = await Ticket.create({
      ticketId,
      customerName,
      customerPhone,
      customerEmail,
      eventName,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      additionalDetails,
      qrCode,
      createdBy: payload.userId,
    });

    return NextResponse.json(
      {
        message: 'Ticket created successfully',
        ticket: {
          ticketId: ticket.ticketId,
          customerName: ticket.customerName,
          customerPhone: ticket.customerPhone,
          eventName: ticket.eventName,
          qrCode: ticket.qrCode,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Ticket creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
