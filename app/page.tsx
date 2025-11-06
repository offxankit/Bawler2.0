import Link from "next/link";
import { Ticket, UserCircle, QrCode, Sparkles, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 gradient-shift overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <div className="text-center mb-10 sm:mb-16 animate-slide-down">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl animate-float">
              <Ticket className="w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3 sm:mb-4 tracking-tight px-4">
            Event Ticketing System
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium px-4">
            Streamline your event management with QR code-based ticket verification ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
          {/* Owner Portal */}
          <div className="group bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 hover:shadow-blue-200/50 hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:scale-105 transform animate-slide-up">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <UserCircle className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
              Owner Portal
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center leading-relaxed">
              Create and manage event tickets, generate QR codes, and track entries with powerful analytics
            </p>
            <div className="space-y-3">
              <Link
                href="/owner/login"
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-95 sm:hover:-translate-y-1 text-sm sm:text-base"
              >
                Login to Dashboard
              </Link>
            </div>
          </div>

          {/* Client Portal */}
          <div className="group bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 hover:shadow-purple-200/50 hover:shadow-2xl transition-all duration-500 border border-purple-100 hover:scale-105 transform animate-slide-up animate-delay-200">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <QrCode className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
              Client Portal
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center leading-relaxed">
              Scan QR codes to verify tickets and mark event entries instantly with real-time updates
            </p>
            <div className="space-y-3">
              <Link
                href="/client/login"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-95 sm:hover:-translate-y-1 text-sm sm:text-base"
              >
                Login
              </Link>
              <Link
                href="/client/signup"
                className="block w-full bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-purple-600 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl text-center border-2 border-purple-600 transition-all duration-300 hover:shadow-lg transform active:scale-95 sm:hover:-translate-y-1 text-sm sm:text-base"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-5xl mx-auto mt-12 sm:mt-16 lg:mt-20 animate-slide-up animate-delay-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center hover:bg-white/80 transition-all duration-300 border border-white/50 shadow-lg hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600 text-xs sm:text-sm">End-to-end encryption & JWT authentication</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center hover:bg-white/80 transition-all duration-300 border border-white/50 shadow-lg hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Fast</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Lightning-quick QR verification in milliseconds</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center hover:bg-white/80 transition-all duration-300 border border-white/50 shadow-lg hover:shadow-xl sm:col-span-2 md:col-span-1">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Reliable</h3>
              <p className="text-gray-600 text-xs sm:text-sm">99.9% uptime with MongoDB Atlas</p>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-16 text-center animate-fade-in animate-delay-400">
          <div className="inline-flex items-center gap-2 text-gray-600 bg-white/60 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/50 shadow-lg">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className="text-xs sm:text-sm font-semibold">System Online • All Services Running</span>
          </div>
        </div>
      </div>
    </main>
  );
}
