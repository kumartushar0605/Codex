'use client';
import { useState } from 'react';
import AdminDashboard from '@/Components/AdminDashboard';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Mobile hamburger button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-lg shadow-lg border border-slate-700/50"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full z-40 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-20
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminDashboard sidebarOnly onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1  pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
}