import { CircleChevronDown, CircleChevronUp, EllipsisVertical } from 'lucide-react';

interface MessageTabsProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const MessageTabs: React.FC<MessageTabsProps> = ({ isExpanded, onToggle }) => {
  return (
    <div className="flex justify-start items-center gap-1 pl-4">
      <button 
        onClick={onToggle}
        aria-label={isExpanded ? "Collapse tabs" : "Expand tabs"}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
      >  
        {isExpanded ? (
          <CircleChevronDown size={12} />
        ) : (
          <CircleChevronUp size={12} />
        )}
      </button>
      
      {isExpanded && (
        <>
          <TabButton 
            label="WhatsApp" 
            color="text-green-500" 
          />
          
          <TabButton 
            label="Private Note" 
            color="text-yellow-500" 
          />
        </>
      )}
    </div>
  );
};

interface TabButtonProps {
  label: string;
  color: string;
}

const TabButton: React.FC<TabButtonProps> = ({ label, color }) => (
  <button className={`flex gap-1 items-center px-3 py-1 rounded-t-lg text-xs ${color} font-bold bg-white border border-gray-200 hover:bg-gray-50`}>
    <span>{label}</span>
    <EllipsisVertical size={8} />
  </button>
);

export default MessageTabs;