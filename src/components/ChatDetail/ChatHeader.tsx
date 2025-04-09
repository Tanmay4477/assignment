"use client";

import { Search, Sparkles } from 'lucide-react';
import { getAvatarFallback } from '@/utils/chatUtils';

interface ChatHeaderProps {
  name: string;
  participants: Array<{ id: string; full_name: string }>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, participants }) => {
  return (
    <div className="bg-white p-2 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <span className="text-sm font-medium text-gray-600">
            {getAvatarFallback(name)}
          </span>
        </div>
        <div>
          <h2 className="text-sm font-bold text-black">{name}</h2>
          <p className="text-xs text-gray-500">
            {participants.map(p => p.full_name).join(', ')}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Sparkles size={14} className="text-gray-600 font-bold" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Search size={14} className="text-gray-600 font-bold" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;