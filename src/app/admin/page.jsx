"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/Components/AdminDashboard';
import { useAdmin } from '@/context/AdminContext';
import { useUser } from '@/context/UserContext';

const AdminPage = () => {
    const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdmin();
    const { isAuthenticated: userAuthenticated, loading: userLoading } = useUser();
    const router = useRouter();

      useEffect(() => {
    if (!adminLoading && !userLoading) {
      if (!adminAuthenticated) {
        if (userAuthenticated) {
          // User is logged in but not admin, redirect to main page
          router.push('/');
        } else {
          // No one is logged in, redirect to auth page
          router.push('/auth');
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

    return (
        <div>
            <AdminDashboard />
        </div>
    );
};

export default AdminPage;