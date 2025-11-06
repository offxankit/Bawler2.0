'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Ticket, LogOut, CheckCircle, User, Phone, Mail, Calendar, FileText, Download, Send, Sparkles } from 'lucide-react';
import { isValidE164, toWhatsAppWaMe, getBaseUrl } from '@/lib/utils';

export default function OwnerDashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    eventName: '',
    eventDate: '',
    additionalDetails: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);
  
  const [copiedNotice, setCopiedNotice] = useState(false);

  const openWhatsAppShare = () => {
    if (!success) return;
    const base = getBaseUrl() || (typeof window !== 'undefined' ? window.location.origin : '');
    const ticketLink = `${base}/ticket/${success.ticketId}`;
    const qrImageLink = `${base}/api/tickets/${success.ticketId}/qr`;
    // Clear formatting with labels to help link detection and clickability
    const text = `Hi ${success.customerName}! Your ticket for "${success.eventName}"\n\nTicket ID: ${success.ticketId}\nQR Image: ${qrImageLink}\nTicket Page: ${ticketLink}\n\nShow this QR code at entry.`;
    const url = toWhatsAppWaMe(success.customerPhone, text);
    if (typeof window !== 'undefined') {
      // Best-effort copy so user can paste if WhatsApp prefill is lost
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopiedNotice(true);
          setTimeout(() => setCopiedNotice(false), 2500);
        }).catch(() => {});
      }
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/owner/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);

    try {
      // Basic client-side validation for E.164 phone format
      if (!isValidE164(formData.customerPhone)) {
        setLoading(false);
        setError('Invalid phone number format. Use E.164 format, e.g., +14155552671 or +919876543210');
        return;
      }

      const token = localStorage.getItem('token');

      const response = await fetch('/api/tickets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create ticket');
      }

      setSuccess(data.ticket);
      
      
      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        eventName: '',
        eventDate: '',
        additionalDetails: '',
      });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 gradient-shift">
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/50 sticky top-0 z-50 animate-slide-down">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Owner Dashboard</h1>
              <p className="text-xs hidden sm:block text-gray-600">Ticket Management System</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-2 border-red-500 text-red-600 hover:bg-red-50 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 md:p-10 mb-8 border border-white/50 animate-scale-in">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                <Sparkles className="w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Create Event Ticket
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">Generate QR codes for your events</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-slide-down">
                <p className="font-medium">⚠️ {error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl sm:rounded-2xl animate-slide-up shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 p-2 rounded-full">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-xl text-green-800 mb-3">🎉 Ticket Created Successfully!</p>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl mb-4 border border-green-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        <strong className="text-green-700">Ticket ID:</strong> {success.ticketId}
                      </p>
                      <p className="text-sm text-gray-600">
                        Generated for <strong>{success.customerName}</strong>
                      </p>
                    </div>

                    <div className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl mb-4 shadow-lg border-2 border-dashed border-green-300">
                      <img
                        src={success.qrCode}
                        alt="QR Code"
                        className="w-40 h-40 sm:w-48 md:w-56 sm:h-48 md:h-56 mx-auto animate-scale-in"
                      />
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg mb-4">
                      <p className="text-xs text-gray-700 text-center mb-1">
                        📱 Customer Phone: <strong>{success.customerPhone}</strong>
                      </p>
                      <p className="text-xs text-center text-blue-700 font-medium">
                        🔗 {typeof window !== 'undefined' && window.location.origin}/ticket/{success.ticketId}
                      </p>
                    </div>
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-3">
                      <Button
                        variant="primary"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        onClick={openWhatsAppShare}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Share via WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                        onClick={() => {
                          if (!success) return;
                          const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || '');
                          const qr = `${origin}/api/tickets/${success.ticketId}/qr`;
                          if (typeof window !== 'undefined') window.open(qr, '_blank');
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Customer Name *
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Customer Phone *
                </label>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">📱 Format: E.164 (e.g., +14155552671, +919876543210)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Customer Email
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Ticket className="w-4 h-4 inline mr-1" />
                  Event Name *
                </label>
                <Input
                  type="text"
                  placeholder="Summer Music Festival 2024"
                  value={formData.eventName}
                  onChange={(e) =>
                    setFormData({ ...formData, eventName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Event Date
                </label>
                <Input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Additional Details
                </label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                  rows={3}
                  placeholder="Any additional information..."
                  value={formData.additionalDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, additionalDetails: e.target.value })
                  }
                />
              </div>

              

              <Button
                type="submit"
                variant="primary"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-95 sm:hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6 sm:mt-8 text-base"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Ticket...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Ticket & QR Code
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
