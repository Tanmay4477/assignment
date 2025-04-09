"use client";

import React from 'react';
import { Folder, ListFilter } from 'lucide-react';
import { useChats } from '@/hooks/useChats';
import { useFilters } from '@/hooks/useFilters';
import Spinner from '@/components/ChatList/Spinner';
import ChatListItem from './ChatListItem';
import ChatSearchBar from './ChatSearchBar';
import ChatFilterMenu from './ChatFilterMenu';

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string | null;
}

const ChatList: React.FC<ChatListProps> = ({ 
  onSelectChat, 
  selectedChatId 
}) => {
  const { chats, loading, allTags } = useChats();
  
  const {
    searchTerm,
    setSearchTerm,
    showFilterMenu,
    setShowFilterMenu,
    activeFilters,
    toggleTagFilter,
    toggleUnreadFilter,
    toggleMentionsFilter,
    clearFilters,
    activeFilterCount,
    filteredChats,
  } = useFilters(chats);

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white" data-testid="chat-list">
      {/* Header - Filter and Search */}
      <div className="border-b border-gray-200 flex justify-between text-sm tracking-tighter p-2">
        <div className="flex justify-normal gap-2">
          <button 
            className="flex items-center gap-1 font-bold text-green-600 rounded-md text-sm"
            aria-label="Custom filter"
          >
            <Folder size={16} />
            <div className="text-sm tracking-tight">Custom filter</div>
          </button>
          <button 
            className="bg-gray-100 text-gray-600 rounded-md text-sm p-1"
            aria-label="Save filter"
          >
            Save
          </button>
        </div>
        
        <div className="flex justify-normal gap-2 relative">
          <ChatSearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-20"
          />
          
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)} 
            className={`bg-gray-100 text-green-600 rounded-md text-sm flex items-center gap-1 p-1 ${
              activeFilterCount > 0 ? "bg-green-100" : ""
            }`}
            aria-label="Toggle filter menu"
            aria-expanded={showFilterMenu}
            aria-controls="filter-menu"
          >
            <ListFilter size={16} />
            <span>Filtered</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          
          {/* Filter Menu */}
          {showFilterMenu && (
            <ChatFilterMenu
              allTags={allTags}
              activeFilters={activeFilters}
              onToggleTag={toggleTagFilter}
              onToggleUnread={toggleUnreadFilter}
              onToggleMentions={toggleMentionsFilter}
              onClearFilters={clearFilters}
              onClose={() => setShowFilterMenu(false)}
            />
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Spinner />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm || activeFilterCount > 0
              ? 'No chats match your filters' 
              : 'No chats yet'}
          </div>
        ) : (
          filteredChats.map(chat => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onClick={() => onSelectChat(chat.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;