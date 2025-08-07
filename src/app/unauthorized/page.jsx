'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import Navbar from '@/Components/Homepage/Navbar'

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-lg w-full text-center">
          {/* 404 Text */}
          <div className="text-8xl sm:text-9xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text mb-8">
            404
          </div>

          {/* Error Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h1>

          <p className="text-lg text-slate-300 mb-8">
            The page you're looking for doesn't exist or you don't have permission to access it.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>

            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
