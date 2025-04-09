"use client";

import { Check } from 'lucide-react';
import { getAvatarFallback } from '@/utils/chatUtils';
import { Message } from '@/hooks/useChatMessages';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isCurrentUser = message.sender === 'current-user';

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for other users' messages */}
      {!isCurrentUser && (
        <div className="mr-2 self-start mt-1">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {message.avatar ? (
              <div className="relative h-full w-full">
                <img 
                  src={message.avatar} 
                  alt={message.senderName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // If image fails to load, show fallback
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-600">
                  {getAvatarFallback(message.senderName)}
                </div>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {getAvatarFallback(message.senderName)}
              </span>
            )}
          </div>
        </div>
      )}

      <div className={`max-w-xs sm:max-w-sm md:max-w-md rounded-lg px-3 py-2 shadow-sm ${
        isCurrentUser
          ? 'bg-green-100 text-gray-800'
          : 'bg-white text-gray-800'
      }`}>
        {!isCurrentUser && (
          <div className="text-xs font-medium min-w-44 flex justify-between" style={{ color: '#4caf50' }}>
            {message.senderName}
            {message.senderPhone && (
              <span className="text-[10px] text-gray-300 font-medium">
                {message.senderPhone}
              </span>
            )}
          </div>
        )}
        <p className="text-sm">{message.text}</p>
        <div className="flex justify-end items-center mt-1 space-x-1">
          <span className="text-xs text-gray-500">{message.time}</span>
          {isCurrentUser && (
            <div className="flex">
              <Check size={14}
                className={message.isRead ? 'text-blue-500' : 'text-gray-400'}
              />
              <Check size={14}
                className={message.isRead ? 'text-blue-500' : 'text-gray-400'}
                style={{ marginLeft: -4 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;