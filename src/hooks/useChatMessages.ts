import { useState, useEffect } from 'react';
import { chatsData } from '@/mocks/ChatDetailMock';
import { 
  initializeDB, 
  getMessagesByChat, 
  saveMessageToDB, 
  clearMessagesForChat 
} from '@/services/indexedDbService';

export interface Message {
  id: string;
  chatId: string;
  text: string;
  time: string;
  sender: string;
  senderName: string;
  senderPhone?: string;
  isRead: boolean;
  isSent: boolean;
  isDelivered: boolean;
  avatar?: string;
}

export interface ChatInfo {
  id: string;
  name: string;
  isGroup: boolean;
  participants: Array<{ id: string; full_name: string }>;
}

/**
 * Ensures mock data is properly initialized in IndexedDB
 * @param chatId The ID of the chat to initialize
 */
const ensureMockDataInitialized = async (chatId: string) => {
  console.log(`Ensuring mock data is initialized for chat ${chatId}`);
  
  try {
    // 1. Check if data exists in IndexedDB
    const existingMessages = await getMessagesByChat(chatId);
    
    if (existingMessages && existingMessages.length > 0) {
      console.log(`Found ${existingMessages.length} existing messages for chat ${chatId}`);
      return existingMessages;
    }
    
    console.log(`No messages found in IndexedDB for chat ${chatId}, initializing from mock data`);
    
    // 2. Get mock data
    const mockChatData = chatsData[chatId];
    console.log("Tanmay cinsole in fincing rhm mock data", mockChatData);
    if (!mockChatData || !mockChatData.messages || !Array.isArray(mockChatData.messages)) {
      console.error(`Invalid or missing mock data for chat ${chatId}`);
      return [];
    }
    
    // 3. Clear any existing data first
    try {
      await clearMessagesForChat(chatId);
    } catch (clearError) {
      console.warn(`Error clearing existing messages: ${clearError}`);
      // Continue anyway
    }
    
    // 4. Prepare messages for IndexedDB
    const messagesToSave = mockChatData.messages.map((msg: any, index: number) => {
      // Create a properly structured message with all required fields
      return {
        id: msg.id || `msg-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
        chatId: chatId, // Ensure chatId is set
        text: msg.text || 'Empty message',
        time: msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: msg.sender === 'current-user' ? 'current-user' : msg.sender,
        senderName: msg.senderName || 'Unknown',
        isRead: typeof msg.isRead === 'boolean' ? msg.isRead : false,
        isSent: typeof msg.isSent === 'boolean' ? msg.isSent : true,
        isDelivered: typeof msg.isDelivered === 'boolean' ? msg.isDelivered : false,
        ...(msg.senderPhone ? { senderPhone: msg.senderPhone } : {}),
        ...(msg.avatar ? { avatar: msg.avatar } : {})
      };
    });
    
    console.log(`Saving ${messagesToSave.length} messages to IndexedDB for chat ${chatId}`);
    
    // 5. Save each message to IndexedDB with robust error handling
    const savePromises = messagesToSave.map(async (message: any, index: any) => {
      try {
        console.log(`Saving message ${index + 1}/${messagesToSave.length}: ${message.id}`);
        await saveMessageToDB(message);
        return true;
      } catch (saveError) {
        console.error(`Error saving message ${message.id}:`, saveError);
        return false;
      }
    });
    
    // Wait for all messages to be saved
    const saveResults = await Promise.all(savePromises);
    const successCount = saveResults.filter(result => result).length;
    
    console.log(`Successfully saved ${successCount}/${messagesToSave.length} messages to IndexedDB`);
    
    // 6. Verify data was saved
    const verifyMessages = await getMessagesByChat(chatId);
    console.log(`Verification: found ${verifyMessages.length} messages in IndexedDB for chat ${chatId}`);
    
    return verifyMessages.length > 0 ? verifyMessages : messagesToSave;
  } catch (error) {
    console.error(`Error initializing mock data for chat ${chatId}:`, error);
    
    // Return mock data as fallback
    const mockChatData = chatsData[chatId];
    if (mockChatData && mockChatData.messages) {
      return mockChatData.messages.map((msg: any) => ({
        ...msg,
        chatId,
        sender: msg.sender === 'current-user' ? 'current-user' : msg.sender
      }));
    }
    
    return [];
  }
};

export const useChatMessages = (chatId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize IndexedDB when hook is first used
  useEffect(() => {
    const setupDB = async () => {
      try {
        const success = await initializeDB();
        setDbInitialized(success);
        console.log('IndexedDB initialization status:', success);
      } catch (error) {
        console.error('Error initializing IndexedDB:', error);
        setDbInitialized(false);
      }
    };
    
    setupDB();
  }, []);

  // Load messages when chatId changes
  useEffect(() => {
    if (!chatId || !dbInitialized) return;
    
    const loadMessages = async () => {
      try {
        setLoading(true);
        console.log('Loading messages for chat ID:', chatId);
        
        // First, set chat info for better UX
        const mockChatData = chatsData[chatId];
        if (mockChatData) {
          setChatInfo({
            id: chatId,
            name: mockChatData.name,
            isGroup: mockChatData.participants.length > 2,
            participants: mockChatData.participants
          });
        } else {
          setChatInfo({
            id: chatId,
            name: `Chat ${chatId.split('-').pop()}`,
            isGroup: false,
            participants: [{ id: 'unknown', full_name: 'Unknown User' }]
          });
        }
        
        // Ensure mock data is initialized in IndexedDB
        const chatMessages = await ensureMockDataInitialized(chatId);
        
        // Set messages in state
        if (chatMessages && chatMessages.length > 0) {
          console.log(`Setting ${chatMessages.length} messages in state`);
          setMessages(chatMessages);
        } else {
          console.error('Failed to load or initialize messages');
          setMessages([]);
        }
      } catch (error) {
        console.error('Error in loadMessages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, [chatId, dbInitialized]);

  // Handle sending a new message
  const sendMessage = async (text: string) => {
    if (!text.trim() || !chatId) return;

    try {
      // Create a new message with a more unique ID
      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        chatId,
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'current-user',
        senderName: 'You',
        isRead: false,
        isSent: true,
        isDelivered: false
      };

      // Update UI first for better UX (optimistic update)
      setMessages(prev => [...prev, newMessage]);
      
      // Then save to IndexedDB
      await saveMessageToDB(newMessage);
      console.log('New message saved successfully:', newMessage.id);
    } catch (error) {
      console.error('Error saving new message to IndexedDB:', error);
      // Message already added to UI through optimistic update
    }
  };

  // Reset chat data for debugging
  const resetChat = async () => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      console.log(`Resetting chat ${chatId} to initial state`);
      
      // Clear existing messages
      await clearMessagesForChat(chatId);
      console.log('Messages cleared, reinitializing from mock data');
      
      // Reinitialize from mock data
      const freshMessages = await ensureMockDataInitialized(chatId);
      setMessages(freshMessages);
      
      setLoading(false);
      console.log('Chat reset complete');
    } catch (error) {
      console.error('Error resetting chat:', error);
      setLoading(false);
    }
  };

  return {
    messages,
    chatInfo,
    loading,
    sendMessage,
    resetChat
  };
};