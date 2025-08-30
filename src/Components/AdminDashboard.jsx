"use client"
import React from 'react';
import {
  Users, Calendar, MessageSquare, Trophy, Settings,
  Bell, Code, BarChart3, LogOut
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';

const AdminDashboard = ({ sidebarOnly, onNavigate }) => {
  const { admin, logout, navigateToAdmin } = useAdmin();
  const router = useRouter();
  const stats = {
    totalUsers: 0,
    activeEvents: 0,
    pendingApprovals: 0,
    totalProjects: 0
  };
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, route: '/admin' },
    { id: 'users', label: 'Users', icon: Users, route: '/admin/users' },
    { id: 'events', label: 'Events', icon: Calendar, route: '/admin/events' },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare, route: '/admin/announcements' },
    { id: 'projects', label: 'Projects', icon: Code, route: '/admin/projects' },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
  return (
    <div className="w-64 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl border-r border-slate-700/50 shadow-xl rounded-tr-3xl rounded-br-3xl flex flex-col h-full">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25">
              <span className="text-white font-black text-lg">C</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
              codex admin
            </span>
            <p className="text-xs text-gray-400 -mt-1">SOA ITER</p>
          </div>
        </div>
      </div>
      <nav className="mt-6 flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.route) {
                  navigateToAdmin(item.route);
                  onNavigate?.(); // Close mobile menu after navigation
                }
              }}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-300 font-medium rounded-xl mb-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50 cursor-pointer`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      {/* Optionally, add admin info and logout at the bottom */}
      <div className="p-6 border-t border-slate-700/50 mt-auto">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {admin?.fullName?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-cyan-400 font-medium block text-sm">
              {admin?.fullName || 'Admin'}
            </span>
            <span className="text-gray-400 text-xs">
              {admin?.regNumber || 'Admin'}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors w-full cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
      {/* If not sidebarOnly, render dashboard content here */}
      {!sidebarOnly && (
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Users</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Active Events</p>
                    <p className="text-3xl font-bold">{stats.activeEvents}</p>
                  </div>
                  <Calendar className="h-12 w-12 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Pending Approvals</p>
                    <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
                  </div>
                  <Bell className="h-12 w-12 text-orange-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Projects</p>
                    <p className="text-3xl font-bold">{stats.totalProjects}</p>
                  </div>
                  <Code className="h-12 w-12 text-purple-200" />
                </div>
              </div>
            </div>
            {/* You can add more dashboard widgets here if needed */}
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;