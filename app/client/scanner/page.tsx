'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { QrCode, LogOut, CheckCircle, XCircle, Scan, Upload } from 'lucide-react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

export default function ClientScanner() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/client/login');
    }
  }, [router]);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanner]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const startScanning = () => {
    setScanMode('camera');
    setScanning(true);
    setTicketData(null);
    setError('');

    // Add a small delay to ensure the DOM element is ready
    setTimeout(() => {
      try {
        const html5QrcodeScanner = new Html5QrcodeScanner(
          'qr-reader',
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            rememberLastUsedCamera: true,
          },
          /* verbose= */ false
        );

        html5QrcodeScanner.render(
          (decodedText) => {
            handleScanSuccess(decodedText);
            html5QrcodeScanner.clear().catch(console.error);
            setScanning(false);
            setScanMode(null);
          },
          (errorMessage) => {
            // Ignore frequent scan errors, only log critical ones
            if (errorMessage.includes('NotAllowedError') || errorMessage.includes('NotFoundError')) {
              console.error('Camera error:', errorMessage);
              setError('Camera access denied or not found. Please allow camera permissions and try again.');
              setScanning(false);
              setScanMode(null);
            }
          }
        );

        setScanner(html5QrcodeScanner);
      } catch (err) {
        console.error('Scanner initialization error:', err);
        setError('Failed to initialize camera scanner. Please check permissions.');
        setScanning(false);
        setScanMode(null);
      }
    }, 100);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
      setScanner(null);
    }
    setScanning(false);
    setScanMode(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setTicketData(null);

    try {
      // Create a unique ID for this scan instance
      const scannerId = `qr-file-reader-${Date.now()}`;
      
      // Create a temporary div element
      const tempDiv = document.createElement('div');
      tempDiv.id = scannerId;
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);

      const html5QrCode = new Html5Qrcode(scannerId);
      
      try {
        const decodedText = await html5QrCode.scanFile(file, true);
        await handleScanSuccess(decodedText);
        await html5QrCode.clear();
      } catch (scanError) {
        throw scanError;
      } finally {
        // Clean up the temporary div
        document.body.removeChild(tempDiv);
      }
    } catch (err: any) {
      console.error('QR scan error:', err);
      if (err.message && err.message.includes('QR code parse error')) {
        setError('No QR code found in the image. Please ensure the image contains a clear, visible QR code.');
      } else {
        setError('Failed to read QR code from image. Please try a different image or use camera scan.');
      }
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openFileUpload = () => {
    setScanMode('upload');
    fileInputRef.current?.click();
  };

  const handleScanSuccess = async (decodedText: string) => {
    try {
      const qrData = JSON.parse(decodedText);
      const ticketId = qrData.ticketId;

      if (!ticketId) {
        setError('Invalid QR code - no ticket ID found');
        return;
      }

      // Fetch ticket details
      const response = await fetch(`/api/tickets/${ticketId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ticket');
      }

      setTicketData(data.ticket);
    } catch (err: any) {
      setError(err.message || 'Invalid QR code format');
    }
  };

  const handleVerifyEntry = async () => {
    if (!ticketData) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/tickets/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticketId: ticketData.ticketId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Update ticket data with entry confirmation
      setTicketData({ ...ticketData, hasEntered: true, entryTime: data.ticket.entryTime });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 gradient-shift">
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/50 sticky top-0 z-50 animate-slide-down">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
              <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Ticket Scanner</h1>
              <p className="text-xs hidden sm:block text-gray-600">Verify event entries</p>
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
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 md:p-10 border border-white/50 animate-scale-in">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                Scan Ticket QR Code
              </h2>
              <p className="text-sm sm:text-base text-gray-600">Choose your preferred scanning method</p>
            </div>

            {!scanning && !ticketData && !loading && (
              <div className="text-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
                  {/* Camera Scan Option */}
                  <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 hover:shadow-xl active:scale-95 sm:hover:scale-105 cursor-pointer animate-slide-up"
                    onClick={startScanning}>
                    <div className="flex justify-center mb-4 sm:mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                          <Scan className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">Scan with Camera</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                      Use your device camera to scan QR codes in real-time
                    </p>
                    <Button
                      variant="primary"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg text-sm sm:text-base py-3"
                      onClick={(e) => { e.stopPropagation(); startScanning(); }}
                    >
                      <Scan className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Start Camera</span>
                      <span className="sm:hidden">Camera</span>
                    </Button>
                  </div>

                  {/* Upload QR Code Option */}
                  <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl active:scale-95 sm:hover:scale-105 cursor-pointer animate-slide-up animate-delay-200"
                    onClick={openFileUpload}>
                    <div className="flex justify-center mb-4 sm:mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">Upload QR Image</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                      Upload a saved QR code image from your device
                    </p>
                    <Button
                      variant="primary"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg text-sm sm:text-base py-3"
                      onClick={(e) => { e.stopPropagation(); openFileUpload(); }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Choose File</span>
                      <span className="sm:hidden">Upload</span>
                    </Button>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {loading && !ticketData && (
              <div className="text-center py-12 animate-fade-in">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
                <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Processing QR code...</p>
              </div>
            )}

            {scanning && (
              <div>
                <div className="mb-4 text-center text-sm text-gray-600">
                  <p className="mb-2">📷 Camera should turn on now...</p>
                  <p className="text-xs">If prompted, please allow camera access</p>
                </div>
                <div id="qr-reader" className="mb-4"></div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={stopScanning}
                >
                  Stop Scanning
                </Button>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3 animate-slide-down">
                <XCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {ticketData && (
              <div className="mt-4 sm:mt-6 animate-slide-up">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-blue-200 shadow-lg">
                  <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 sm:mb-6">
                    Ticket Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Ticket ID:</span>
                      <p className="font-semibold text-gray-900">{ticketData.ticketId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Customer Name:</span>
                      <p className="font-semibold text-gray-900">{ticketData.customerName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Event:</span>
                      <p className="font-semibold text-gray-900">{ticketData.eventName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <p className="font-semibold text-gray-900">{ticketData.customerPhone}</p>
                    </div>
                    {ticketData.additionalDetails && (
                      <div>
                        <span className="text-sm text-gray-600">Details:</span>
                        <p className="text-gray-900">{ticketData.additionalDetails}</p>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <span className="text-sm text-gray-600">Entry Status:</span>
                      {ticketData.hasEntered ? (
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-600">
                            Already Entered
                          </span>
                        </div>
                      ) : (
                        <p className="font-semibold text-orange-600 mt-1">
                          Not Yet Entered
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {ticketData.hasEntered ? (
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 text-green-800 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 shadow-lg animate-scale-in">
                    <div className="bg-green-500 p-2 rounded-full">
                      <CheckCircle className="w-8 h-8 text-white flex-shrink-0" />
                    </div>
                    <div>
                      <p className="font-bold text-base sm:text-lg">🎉 Entry Already Recorded</p>
                      {ticketData.entryTime && (
                        <p className="text-sm mt-1">
                          Entered at: {new Date(ticketData.entryTime).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <label className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                        <input
                          type="radio"
                          name="entry-confirmation"
                          className="w-5 h-5 text-purple-600"
                          required
                        />
                        <span className="text-gray-900 font-medium">
                          Confirm that {ticketData.customerName} has entered the event
                        </span>
                      </label>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-95 sm:hover:-translate-y-1 text-base"
                      onClick={handleVerifyEntry}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Verify Entry
                        </span>
                      )}
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full mt-3 sm:mt-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform active:scale-95 sm:hover:-translate-y-1 text-sm sm:text-base"
                  onClick={() => {
                    setTicketData(null);
                    setError('');
                    setScanMode(null);
                  }}
                >
                  Scan Another Ticket
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
