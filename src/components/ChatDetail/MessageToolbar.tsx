"use client";

import { 
  Paperclip, 
  Smile, 
  Clock, 
  Calendar, 
  Sparkles, 
  FileText, 
  Mic 
} from 'lucide-react';

const tools = [
  { icon: Paperclip, label: "Attach file", hover: "text-gray-900" },
  { icon: Smile, label: "Insert emoji", hover: "text-gray-600" },
  { icon: Clock, label: "Schedule message", hover: "text-gray-600" },
  { icon: Calendar, label: "Set calendar event", hover: "text-gray-600" },
  { icon: Sparkles, label: "Use AI assistant", hover: "text-gray-900" },
  { icon: FileText, label: "Attach document", hover: "text-gray-900" },
  { icon: Mic, label: "Voice message", hover: "text-gray-800" }
];

const MessageToolbar: React.FC = () => {
  return (
    <div className="flex space-x-5 mr-3">
      {tools.map((tool, index) => (
        <ToolButton 
          key={index}
          Icon={tool.icon}
          label={tool.label}
          hoverClass={tool.hover}
        />
      ))}
    </div>
  );
};

interface ToolButtonProps {
  Icon: React.ElementType;
  label: string;
  hoverClass: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ Icon, label, hoverClass }) => (
  <button 
    className={`text-gray-700 hover:${hoverClass} focus:outline-none`}
    aria-label={label}
    title={label}
  >
    <Icon size={16} />
  </button>
);

export default MessageToolbar;