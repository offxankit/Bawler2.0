'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Ticket, Download, CheckCircle, XCircle, User, Phone, Mail, Calendar, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/Button';

export default function PublicTicketView() {
  const params = useParams();
  const ticketId = params.ticketId as string;
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ticket');
      }

      setTicket(data.ticket);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!ticket?.qrCode) return;

    const link = document.createElement('a');
    link.href = ticket.qrCode;
    link.download = `ticket-${ticketId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 gradient-shift flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-50 to-red-50 gradient-shift flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center border border-white/50 animate-scale-in">
          <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Ticket Not Found</h1>
          <p className="text-gray-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 gradient-shift p-3 sm:p-4">
      <div className="container mx-auto py-4 sm:py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-5 sm:p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <div className="bg-white/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl mr-2 sm:mr-3">
                    <Ticket className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold">Event Ticket</h1>
                </div>
                <p className="text-center text-white/90 text-base sm:text-lg font-semibold">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Ticket ID: {ticket.ticketId}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-10">
              {/* Entry Status Badge */}
              {ticket.hasEntered && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 shadow-lg animate-slide-down">
                  <div className="bg-green-500 p-2 rounded-full">
                    <CheckCircle className="w-8 h-8 text-white flex-shrink-0" />
                  </div>
                  <div>
                    <p className="font-bold text-lg sm:text-xl text-green-800">🎉 Entry Verified</p>
                    <p className="text-xs sm:text-sm text-green-700 mt-1">
                      Entered at: {new Date(ticket.entryTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Ticket Details */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 sm:mb-6">Ticket Details</h2>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 border border-blue-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-gray-200 gap-1 sm:gap-0">
                    <span className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      Customer Name:
                    </span>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">{ticket.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Ticket className="w-4 h-4" />
                      Event:
                    </span>
                    <span className="font-bold text-gray-900">{ticket.eventName}</span>
                  </div>
                  {ticket.eventDate && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Event Date:
                      </span>
                      <span className="font-bold text-gray-900">
                        {new Date(ticket.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone:
                    </span>
                    <span className="font-bold text-gray-900">{ticket.customerPhone}</span>
                  </div>
                  {ticket.customerEmail && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email:
                      </span>
                      <span className="font-bold text-gray-900">{ticket.customerEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center border-2 border-purple-200">
                <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 sm:mb-6">Your QR Code</h3>
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl inline-block shadow-xl mb-4 sm:mb-6 border-2 border-dashed border-purple-300">
                  <img
                    src={ticket.qrCode}
                    alt="Ticket QR Code"
                    className="w-48 h-48 sm:w-60 md:w-72 sm:h-60 md:h-72 mx-auto animate-scale-in"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-700 mb-5 sm:mb-6 font-medium px-2">
                  🎫 Show this QR code at the event entrance for verification
                </p>
                <Button
                  variant="primary"
                  onClick={downloadQRCode}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 sm:hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Download QR Code
                </Button>
              </div>

              {ticket.additionalDetails && (
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-200">
                  <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Additional Information
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{ticket.additionalDetails}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center animate-fade-in px-2">
            <div className="inline-flex items-center gap-2 text-gray-600 bg-white/60 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/50 shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              <p className="text-xs sm:text-sm font-semibold">Keep this ticket safe • Show it at the event entrance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
