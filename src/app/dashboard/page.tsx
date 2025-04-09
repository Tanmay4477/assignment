"use client";

import { useState } from 'react';
import ChatList from '@/components/ChatList/ChatList';
import ChatDetail from '@/components/ChatDetail/ChatDetail';
import RightSidebar from '@/components/SideBar/RightSidebar';

export default function DashboardPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>('chat-5'); // Default to chat-5 (Test El Centro)
  
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="h-full flex w-full">
      {/* Chat List (Left Side) */}
      <div className="w-1/4 h-full">
        <ChatList 
          onSelectChat={handleSelectChat} 
          selectedChatId={selectedChatId}
        />
      </div>
      
      {/* Chat Detail (Middle) */}
      <div className="flex-1 h-full">
        <ChatDetail chatId={selectedChatId} />
      </div>

      {/* Right Sidebar */}
      <div className="h-full">
        <RightSidebar />
      </div>
    </div>
  );
}