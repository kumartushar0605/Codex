import AdminDashboard from '@/Components/AdminDashboard';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-20">
        <AdminDashboard sidebarOnly />
      </div>
      {/* Main content, with left margin to accommodate sidebar width */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}