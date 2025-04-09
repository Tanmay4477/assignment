import React from 'react';
import { getAvatarFallback } from '@/utils/formatters';

interface ChatAvatarProps {
  name: string;
  avatar?: string;
  unreadCount?: number;
  isPinned?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({
  name,
  avatar,
  unreadCount,
  isPinned,
  size = 'md'
}) => {
  const sizeClass = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-12 w-12 text-lg',
    lg: 'h-16 w-16 text-xl'
  };

  const badgeSize = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  };

  const pinSize = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="relative">
      <div className={`rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${sizeClass[size]}`}>
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-medium text-gray-600">
            {getAvatarFallback(name)}
          </span>
        )}
      </div>
      
      {unreadCount && unreadCount > 0 && (
        <div className={`absolute bottom-0 right-0 bg-green-500 text-white flex items-center justify-center rounded-full ${badgeSize[size]}`}>
          {unreadCount}
        </div>
      )}
      
      {isPinned && (
        <div className={`absolute top-0 left-0 bg-blue-500 rounded-full ${pinSize[size]}`} />
      )}
    </div>
  );
};

export default ChatAvatar;