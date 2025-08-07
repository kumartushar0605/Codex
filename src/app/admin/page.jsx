"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { useUser } from '@/context/UserContext';
import { Users, Calendar, Bell, Code } from 'lucide-react';

const AdminPage = () => {
    const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdmin();
    const { isAuthenticated: userAuthenticated, loading: userLoading } = useUser();
    const router = useRouter();

      useEffect(() => {
    if (!adminLoading && !userLoading) {
      if (!adminAuthenticated) {
        if (userAuthenticated) {
          // User is logged in but not admin, redirect to unauthorized page
          router.push('/unauthorized');
        } else {
          // No one is logged in, redirect to auth page
          router.push('/');
        }
      }
    }
  }, [adminAuthenticated, adminLoading, userAuthenticated, userLoading, router]);

    if (adminLoading || userLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (!adminAuthenticated) {
        return null; // Will redirect
    }

    // Dashboard summary content only (no sidebar)
    const stats = {
      totalUsers: 0,
      activeEvents: 0,
      pendingApprovals: 0,
      totalProjects: 0
    };
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 sm:p-6 lg:p-6">
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
        </div>
      </div>
    );
};

export default AdminPage;