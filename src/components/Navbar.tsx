import { 
  RefreshCw, 
  HelpCircle, 
  Circle, 
  MonitorDown, 
  BellOff, 
  Menu,
  MessageCircleMore,
  ChevronsUpDown,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  // const [activeDevices, setActiveDevices] = useState(5);
  // const [totalDevices, setTotalDevices] = useState(6);

  const activeDevices = 5;
  const totalDevices = 6;

  return (
    <div className="h-10 bg-white border-b border-gray-200 px-2 flex items-center justify-between">
      {/* Left side: Title */}
      <div className="flex items-center">
        <button className="flex items-center text-gray-600 font-medium text-sm hover:bg-gray-100 py-1 px-2 rounded-md">
          <MessageCircleMore size={14} className="mr-1" />
          <span>chats</span>
        </button>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-3">
        {/* Refresh Button */}
        <button 
          className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-md flex items-center justify-center bg-white border border-white shadow-sm"
          title="Refresh"
        >
          <RefreshCw size={14} className="mr-1" />
          <span className="text-xs">Refresh</span>
        </button>

        {/* Help Button */}
        <button 
          className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-md flex items-center justify-center bg-white border border-white shadow-sm"
          title="Help"
        >
          <HelpCircle size={14} className="mr-1" />
          <span className="text-xs">Help</span>
        </button>

        {/* Devices Status */}
        <div className="flex items-center text-xs text-gray-600 px-2 py-1 rounded-md bg-white border border-white shadow-sm">
          <Circle size={14} color='yellow' className="mr-1 bg-yellow-300 rounded-full" />
          <span>{activeDevices} / {totalDevices} phones</span>
          <ChevronsUpDown size={14} className="mr-1" />
        </div>

        {/* Download Button */}
        <button 
          className="p-1 text-gray-500 hover:bg-gray-100 rounded-md flex items-center justify-center bg-white border border-white shadow-sm"
          title="Download"
        >
          <MonitorDown size={14} />
        </button>

        {/* Notifications */}
        <button 
          className="p-1 text-gray-500 hover:bg-gray-100 rounded-md flex items-center justify-center bg-white border border-white shadow-sm"
          title="Notifications"
        >
          <BellOff size={14} />
        </button>

        {/* Menu */}
        <button 
          className="p-1 text-gray-500 hover:bg-gray-100 rounded-md flex items-center justify-center gap-2 bg-white border border-white shadow-sm"
          title="Menu"
        >
          <Sparkles size={14} className='text-amber-400'/>
          <Menu size={14} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;