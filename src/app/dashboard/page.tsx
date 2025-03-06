// app/dashboard/page.tsx
"use client";

import { useState } from 'react';
import ChatList from '@/components/ChatList';
import ChatDetail from '@/components/ChatDetail';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>("1"); // Default to first chat
  
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="h-full flex">
      {/* Chat List (Left Side) */}
      <div className="w-1/3 h-full">
        <ChatList 
          onSelectChat={handleSelectChat} 
          selectedChatId={selectedChatId}
        />
      </div>
      
      {/* Chat Detail (Right Side) */}
      <div className="w-2/3 h-full">
        {selectedChatId ? (
          <ChatDetail chatId={selectedChatId} />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700">Select a chat to start messaging</h3>
              <p className="text-sm text-gray-500 mt-2">Choose a conversation from the list</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}