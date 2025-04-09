"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  MessageCircleMore, 
  Ticket, 
  ChartLine, 
  List, 
  Volume2, 
  Network, 
  FileText, 
  BookUser, 
  ListChecks, 
  Settings,
  SlidersVertical,
  FileJson2
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  
  const topNavigation = [
    { name: 'Home', href: '/dashboard/home', icon: Home },
    { name: 'Messages', href: '/dashboard', icon: MessageCircleMore },
    { name: 'Tickets', href: '/dashboard/tickets', icon: Ticket },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartLine },
    { name: 'List', href: '/dashboard/list', icon: List },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Volume2 },
    { name: 'Network', href: '/dashboard/network', icon: Network },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'Media', href: '/dashboard/media', icon: BookUser },
    { name: 'Tasks', href: '/dashboard/tasks', icon: ListChecks },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];
  
  const bottomNavigation = [
    { name: 'Settings', href: '/dashboard/settings', icon: SlidersVertical },
    { name: 'Favorites', href: '/dashboard/favorites', icon: FileJson2 },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="h-screen w-16 flex flex-col bg-white shadow-md p-2 border-r border-gray-200">
      {/* Logo */}
      <div className="flex justify-center">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="h-8 w-8"
          // If your logo isn't circular, remove the rounded-full class
          // className="h-8 w-8 rounded-full" 
        />
      </div>
      
      {/* Top Navigation - 60% of height */}
      <nav className="flex flex-col items-center space-y-0.5 py-2" style={{ height: '30%' }}>
        {topNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                isActive(item.href) 
                ? 'bg-gray-200 text-green-700 font-bold' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title={item.name}
          >
            <item.icon size={20} />
          </Link>
        ))}
      </nav>
      
      {/* Gap - 30% of height */}
      <div className="flex-grow" style={{ height: '30%' }}></div>
      
      {/* Bottom Navigation - 10% of height */}
      <nav className="flex flex-col items-center space-y-2 py-2 mb-4" style={{ height: '10%' }}>
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
              isActive(item.href) ? 'text-green-600' : 'text-gray-500'
            }`}
            title={item.name}
          >
            <item.icon size={20} />
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;