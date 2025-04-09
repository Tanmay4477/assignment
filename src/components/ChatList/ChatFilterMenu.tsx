'use client'

import React from 'react';
import ChatTagBadge from './ChatTagBadge';
import { FilterOptions } from '@/types/chat';

interface ChatFilterMenuProps {
  allTags: string[];
  activeFilters: FilterOptions;
  onToggleTag: (tag: string) => void;
  onToggleUnread: () => void;
  onToggleMentions: () => void;
  onClearFilters: () => void;
  onClose: () => void;
}

const ChatFilterMenu: React.FC<ChatFilterMenuProps> = ({
  allTags,
  activeFilters,
  onToggleTag,
  onToggleUnread,
  onToggleMentions,
  onClearFilters,
  onClose
}) => {
  return (
    <div 
      className="absolute top-12 right-2 bg-white shadow-lg rounded-md border border-gray-200 p-3 z-10 w-64"
      data-testid="filter-menu"
    >
      <div className="border-b pb-2 mb-2">
        <h3 className="font-medium text-sm">Filter by Tags</h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {allTags.map(tag => (
            <ChatTagBadge
              key={tag}
              tag={{ id: tag, name: tag, color: '#6366f1' }}
              onClick={() => onToggleTag(tag)}
              isActive={activeFilters.tags.includes(tag)}
              size="xs"
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={activeFilters.unread}
            onChange={onToggleUnread}
            className="rounded text-indigo-600"
          />
          Show only unread
        </label>
        
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={activeFilters.mentions}
            onChange={onToggleMentions}
            className="rounded text-indigo-600"
          />
          With mentions
        </label>
      </div>
      
      <div className="mt-4 flex justify-between">
        <button
          onClick={onClearFilters}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear filters
        </button>
        <button
          onClick={onClose}
          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default ChatFilterMenu;