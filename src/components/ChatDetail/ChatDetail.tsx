"use client";

import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import EmptyState from './EmptyState';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useChatScroll } from '@/hooks/useChatScroll';

interface ChatDetailProps {
  chatId?: string;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chatId }) => {
  const { messages, chatInfo, loading, sendMessage } = useChatMessages(chatId);
  const messagesEndRef = useChatScroll(messages);

  // If no chat is selected or chat info is not available
  if (!chatId || !chatInfo) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <ChatHeader 
        name={chatInfo.name} 
        participants={chatInfo.participants} 
      />

      {/* Chat Messages */}
      <MessageList 
        messages={messages}
        loading={loading}
        messagesEndRef={messagesEndRef}
      />

      {/* Message Input */}
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatDetail;