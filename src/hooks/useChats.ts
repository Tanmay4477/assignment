import { useState, useEffect, useCallback } from 'react';
import { initializeDB, getAllChats, saveChatToDB } from '@/services/indexedDbService';
import { ChatItem, DEFAULT_CHATS } from '@/types/chat';

/**
 * Custom hook to manage chat data from IndexedDB
 */
export const useChats = () => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load chats from IndexedDB
  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize the database
      await initializeDB();
      
      // Get all chats from IndexedDB
      const storedChats = await getAllChats();
      
      // If there are no chats stored, populate with default data
      if (storedChats.length === 0) {
        // Save default chats to IndexedDB
        for (const chat of DEFAULT_CHATS) {
          await saveChatToDB(chat);
        }
        
        setChats(DEFAULT_CHATS);
      } else {
        setChats(storedChats);
      }
    } catch (err) {
      console.error('Error loading chats:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading chats'));
      // Fallback to default chats if there's an error
      setChats(DEFAULT_CHATS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Extract all unique tags from chats
  const allTags = [...new Set(chats.flatMap(chat => chat.tags.map(tag => tag.name)))];

  return {
    chats,
    loading,
    error,
    allTags,
    refreshChats: loadChats
  };
};