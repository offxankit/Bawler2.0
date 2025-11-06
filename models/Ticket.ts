import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITicket extends Document {
  ticketId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventName: string;
  eventDate?: Date;
  additionalDetails?: string;
  qrCode: string;
  hasEntered: boolean;
  entryTime?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TicketSchema: Schema<ITicket> = new Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
  },
  customerEmail: {
    type: String,
  },
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
  },
  eventDate: {
    type: Date,
  },
  additionalDetails: {
    type: String,
  },
  qrCode: {
    type: String,
    required: true,
  },
  hasEntered: {
    type: Boolean,
    default: false,
  },
  entryTime: {
    type: Date,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ticket: Model<ITicket> = mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
