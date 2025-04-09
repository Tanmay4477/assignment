import { useState, useCallback, useMemo } from 'react';
import { ChatItem, FilterOptions } from '@/types/chat';

/**
 * Custom hook to manage filtering and searching of chats
 */
export const useFilters = (chats: ChatItem[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    tags: [],
    unread: false,
    mentions: false
  });

  // Toggle a tag in the filter
  const toggleTagFilter = useCallback((tag: string) => {
    setActiveFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }, []);

  // Toggle unread filter
  const toggleUnreadFilter = useCallback(() => {
    setActiveFilters(prev => ({
      ...prev,
      unread: !prev.unread
    }));
  }, []);

  // Toggle mentions filter
  const toggleMentionsFilter = useCallback(() => {
    setActiveFilters(prev => ({
      ...prev,
      mentions: !prev.mentions
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters({
      tags: [],
      unread: false,
      mentions: false
    });
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return activeFilters.tags.length + 
           (activeFilters.unread ? 1 : 0) + 
           (activeFilters.mentions ? 1 : 0);
  }, [activeFilters]);

  // Apply filters to chats
  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      // Filter by search term
      const matchesSearch = 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Filter by tags (if any tags are selected)
      if (activeFilters.tags.length > 0) {
        const chatTags = chat.tags.map(tag => tag.name);
        if (!activeFilters.tags.some(tag => chatTags.includes(tag))) {
          return false;
        }
      }
      
      // Filter by unread status
      if (activeFilters.unread && !chat.unreadCount) {
        return false;
      }
      
      // Filter by mentions
      if (activeFilters.mentions && !chat.mentions) {
        return false;
      }
      
      return true;
    });
  }, [chats, searchTerm, activeFilters]);

  return {
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
  };
};