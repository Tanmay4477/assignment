"use client";

import { RefObject } from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '@/hooks/useChatMessages';
import { formatDate, groupMessagesByDate } from '@/utils/chatUtils';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  loading,
  messagesEndRef 
}) => {
  const groupedMessages = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4"
      style={{ backgroundColor: '[#F0F1F1]' }}
    >
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-3">
          <div className="flex justify-center">
            <div className="bg-white px-3 py-1 rounded-full shadow-sm">
              <span className="text-xs text-gray-500">
                {formatDate()}
              </span>
            </div>
          </div>
          
          {dateMessages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;