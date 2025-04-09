'use client'

import React, { memo } from 'react';
import { ChatItem } from '@/types/chat';
import ChatAvatar from './ChatAvatar';
import ChatTagBadge from './ChatTagBadge';

interface ChatListItemProps {
  chat: ChatItem;
  isSelected: boolean;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = memo(({
  chat,
  isSelected,
  onClick
}) => {
  return (
    <div 
      className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
        isSelected ? 'bg-gray-100' : ''
      }`}
      onClick={onClick}
      data-testid={`chat-item-${chat.id}`}
    >
      <div className="flex items-start">
        {/* Avatar */}
        <div className="mr-3 mt-1">
          <ChatAvatar 
            name={chat.name}
            avatar={chat.avatar}
            unreadCount={chat.unreadCount}
            isPinned={chat.isPinned}
          />
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
            <span className="text-xs text-gray-400">{chat.time}</span>
          </div>
          <p className="text-xs text-gray-500 truncate mt-1">{chat.lastMessage}</p>
          
          <div className="flex items-center mt-1">
            {chat.mentions && (
              <span className="bg-gray-200 p-1 rounded-md text-[8px] text-gray-500 mr-1">+{chat.mentions}</span>
            )}
            <div className="flex flex-wrap gap-1">
              {chat.tags.map((tag) => (
                <ChatTagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatListItem.displayName = 'ChatListItem';

export default ChatListItem;