import {
  PanelRightClose,
  RefreshCw,
  PenLine,
  AlignLeft,
  LayoutList,
  Waypoints,
  Users,
  AtSign,
  FolderRoot,
  SlidersHorizontal
} from 'lucide-react';

const RightSidebar = () => {
  // Array of icons to display
  const icons = [
    { icon: PanelRightClose, label: 'Dashboard' },
    { icon: RefreshCw, label: 'Refresh' },
    { icon: PenLine, label: 'Edit' },
    { icon: AlignLeft, label: 'List' },
    { icon: LayoutList, label: 'Grid' },
    { icon: Waypoints, label: 'Share' },
    { icon: Users, label: 'Users' },
    { icon: AtSign, label: 'Mentions' },
    { icon: FolderRoot, label: 'Media' },
    { icon: SlidersHorizontal, label: 'Analytics' }
  ];

  return (
    <div className="h-full w-12 flex flex-col bg-white shadow-md border-l border-gray-200">
      <div className="flex-1 flex flex-col items-center pt-4 space-y-1">
        {icons.map((item, index) => (
          <button
            key={index}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title={item.label}
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;