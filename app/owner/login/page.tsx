'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { UserCircle, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function OwnerLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'owner',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push('/owner/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 gradient-shift flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-scale-in mx-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/50">
          {/* Icon Header */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-xl">
                <UserCircle className="w-14 h-14 text-white" />
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              Owner Portal
            </h1>
            <p className="text-sm sm:text-base text-gray-600 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
              Access your event management dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-slide-down">
              <p className="font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="owner@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 sm:py-3.5 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 sm:py-3.5 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-95 sm:hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Login to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span className="hidden sm:inline">Secure authentication with JWT encryption</span>
              <span className="sm:hidden">Secure JWT authentication</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
