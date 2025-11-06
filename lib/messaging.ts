import twilio from 'twilio';
import { getBaseUrl } from './utils';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Twilio Sandbox

let twilioClient: ReturnType<typeof twilio> | null = null;

// Initialize Twilio client only if credentials are available
if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

export interface SendMessageOptions {
  to: string;
  customerName: string;
  eventName: string;
  ticketId: string;
  qrCodeUrl: string; // kept for backward compatibility (public ticket page)
  method: 'sms' | 'whatsapp' | 'both';
}

export async function sendTicketMessage(options: SendMessageOptions) {
  const { to, customerName, eventName, ticketId, qrCodeUrl, method } = options;

  if (!twilioClient) {
    throw new Error('Twilio is not configured. Please add credentials to .env file');
  }

  const results = {
    sms: null as any,
    whatsapp: null as any,
    errors: [] as string[],
  };

  // Format phone number (ensure it starts with +)
  const formattedPhone = to.startsWith('+') ? to : `+${to}`;

  // Absolute links (prefer HTTPS) for better auto-linking in SMS apps
  const base = getBaseUrl();
  const qrImageLink = base ? `${base}/api/tickets/${ticketId}/qr` : '';
  const ticketPageLink = base ? `${base}/ticket/${ticketId}` : qrCodeUrl;

  // Message content: keep links on their own lines with full scheme
  const messageBody = `Hi ${customerName}! 🎟️\n\nYour ticket for "${eventName}" is ready.\n\nTicket ID: ${ticketId}\nQR Image:\n${qrImageLink}\nTicket Page:\n${ticketPageLink}\n\nShow this QR code at the event entrance for verification.`;

  // Send SMS
  if (method === 'sms' || method === 'both') {
    try {
      if (!twilioPhoneNumber) {
        throw new Error('Twilio phone number not configured');
      }

      const smsResult = await twilioClient.messages.create({
        body: messageBody,
        from: twilioPhoneNumber,
        to: formattedPhone,
      });

      results.sms = {
        sid: smsResult.sid,
        status: smsResult.status,
        to: smsResult.to,
      };

      console.log('SMS sent successfully:', smsResult.sid);
    } catch (smsError: any) {
      console.error('SMS sending error:', smsError);
      results.errors.push(`SMS failed: ${smsError.message}`);
    }
  }

  // Send WhatsApp
  if (method === 'whatsapp' || method === 'both') {
    try {
      const whatsappResult = await twilioClient.messages.create({
        body: messageBody,
        from: twilioWhatsAppNumber,
        to: `whatsapp:${formattedPhone}`,
      });

      results.whatsapp = {
        sid: whatsappResult.sid,
        status: whatsappResult.status,
        to: whatsappResult.to,
      };

      console.log('WhatsApp sent successfully:', whatsappResult.sid);
    } catch (whatsappError: any) {
      console.error('WhatsApp sending error:', whatsappError);
      results.errors.push(`WhatsApp failed: ${whatsappError.message}`);
    }
  }

  return results;
}

export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && twilioPhoneNumber);
}

export function getTwilioStatus() {
  return {
    configured: isTwilioConfigured(),
    hasSMS: !!(accountSid && authToken && twilioPhoneNumber),
    hasWhatsApp: !!(accountSid && authToken),
  };
}
