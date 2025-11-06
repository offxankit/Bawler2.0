import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

export async function GET(
  _request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    await connectDB();
    const { ticketId } = params;
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket || !ticket.qrCode) {
      return new NextResponse('Not found', { status: 404 });
    }

    // ticket.qrCode is a data URL like data:image/png;base64,...
    const match = ticket.qrCode.match(/^data:image\/(png|jpeg);base64,(.*)$/);
    if (!match) {
      return new NextResponse('Unsupported image format', { status: 400 });
    }
    const base64 = match[2];
    const buffer = Buffer.from(base64, 'base64');
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    return new NextResponse('Server error', { status: 500 });
  }
}
