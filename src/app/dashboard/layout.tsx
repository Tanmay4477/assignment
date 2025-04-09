// app/dashboard/layout.tsx
import Sidebar from '../../components/SideBar/SideBar';
import Navbar from '../../components/Navbar/Navbar';
import ProtectedRoute from '../../components/Protected/protectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    // </ProtectedRoute>
  );
}