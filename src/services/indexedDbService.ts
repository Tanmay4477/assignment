// services/indexedDBService.ts

// Database configuration
const DB_NAME = 'ChatApp';
const DB_VERSION = 1;
const CHATS_STORE = 'chats';
const MESSAGES_STORE = 'messages';

// Chat Interface
interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  tags: { id: string; name: string; color: string }[];
  unreadCount?: number;
  isPinned?: boolean;
  mentions?: string;
}

interface Message {
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

// Connection helper function to avoid duplicating connection code
const connectToDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error("Database error:", (event.target as IDBOpenDBRequest).error);
      reject("Could not open database");
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create chats object store if it doesn't exist
      if (!db.objectStoreNames.contains(CHATS_STORE)) {
        const chatsStore = db.createObjectStore(CHATS_STORE, { keyPath: 'id' });
        chatsStore.createIndex('name', 'name', { unique: false });
      }

      // Create messages object store if it doesn't exist
      if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
        const messagesStore = db.createObjectStore(MESSAGES_STORE, { keyPath: 'id' });
        messagesStore.createIndex('chatId', 'chatId', { unique: false });
      }
    };
  });
};

// Initialize the IndexedDB database
export const initializeDB = async (): Promise<boolean> => {
  try {
    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      console.error("Your browser doesn't support IndexedDB");
      return false;
    }

    await connectToDatabase();
    console.log("Database initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return false;
  }
};

// Get all chats from IndexedDB
export const getAllChats = async (): Promise<ChatItem[]> => {
  try {
    const db = await connectToDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CHATS_STORE, 'readonly');
      const store = transaction.objectStore(CHATS_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject("Error getting chats");
      };
      
      // Ensure database connection is closed when transaction completes
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in getAllChats:', error);
    return [];
  }
};

// Save a chat to IndexedDB
export const saveChatToDB = async (chat: ChatItem): Promise<void> => {
  try {
    const db = await connectToDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CHATS_STORE, 'readwrite');
      const store = transaction.objectStore(CHATS_STORE);
      const request = store.put(chat);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject("Error saving chat");
      };
      
      // Ensure database connection is closed when transaction completes
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in saveChatToDB:', error);
    throw error;
  }
};

// Get messages for a specific chat
export const getMessagesByChat = async (chatId: string): Promise<Message[]> => {
  try {
    console.log(`Getting messages for chat ID: ${chatId}`);
    const db = await connectToDatabase();
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(MESSAGES_STORE, 'readonly');
        const store = transaction.objectStore(MESSAGES_STORE);
        const index = store.index('chatId');
        const request = index.getAll(IDBKeyRange.only(chatId));
        
        request.onsuccess = () => {
          const messages = request.result;
          console.log(`Retrieved ${messages.length} messages for chat ID: ${chatId}`, messages);
          resolve(messages);
        };
        
        request.onerror = (event) => {
          console.error('Error in getMessagesByChat request:', event);
          reject("Error getting messages");
        };
        
        // Ensure database connection is closed when transaction completes
        transaction.oncomplete = () => {
          db.close();
        };
      } catch (error) {
        console.error('Error in getMessagesByChat transaction:', error);
        reject(error);
      }
    });
  } catch (error) {
    console.error('Error in getMessagesByChat:', error);
    return [];
  }
};

// Save a message to IndexedDB
export const saveMessageToDB = async (message: Message): Promise<void> => {
  try {
    // Make sure all required fields are present
    if (!message.id || !message.chatId || !message.text) {
      throw new Error("Message missing required fields");
    }
    
    console.log(`Saving message to DB:`, message);
    
    const db = await connectToDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MESSAGES_STORE, CHATS_STORE], 'readwrite');
      const messagesStore = transaction.objectStore(MESSAGES_STORE);
      const chatsStore = transaction.objectStore(CHATS_STORE);
      
      // Save the message
      const putRequest = messagesStore.put(message);
      
      putRequest.onsuccess = () => {
        console.log(`Message saved successfully: ${message.id}`);
        
        // Update the last message in the chat
        const getRequest = chatsStore.get(message.chatId);
        
        getRequest.onsuccess = () => {
          const chat = getRequest.result;
          if (chat) {
            chat.lastMessage = `${message.senderName}: ${message.text}`;
            chat.time = message.time;
            chatsStore.put(chat);
          }
          resolve();
        };
        
        getRequest.onerror = (event) => {
          console.error('Error getting chat for message update:', event);
          // Still resolve since the message was saved successfully
          resolve();
        };
      };

      putRequest.onerror = (event) => {
        console.error('Error saving message:', event);
        reject("Error saving message");
      };
      
      // Ensure database connection is closed when transaction completes
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in saveMessageToDB:', error);
    throw error;
  }
};

// Delete a chat and its messages
export const deleteChat = async (chatId: string): Promise<void> => {
  try {
    const db = await connectToDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CHATS_STORE, MESSAGES_STORE], 'readwrite');
      const chatsStore = transaction.objectStore(CHATS_STORE);
      const messagesStore = transaction.objectStore(MESSAGES_STORE);
      const index = messagesStore.index('chatId');
      
      // Delete the chat
      const deleteRequest = chatsStore.delete(chatId);
      
      deleteRequest.onsuccess = () => {
        // Get all messages for this chat
        const messagesRequest = index.getAllKeys(IDBKeyRange.only(chatId));
        
        messagesRequest.onsuccess = () => {
          const messageIds = messagesRequest.result;
          // Delete each message
          messageIds.forEach((messageId) => {
            messagesStore.delete(messageId);
          });
          resolve();
        };
        
        messagesRequest.onerror = () => {
          reject("Error getting message IDs");
        };
      };

      deleteRequest.onerror = () => {
        reject("Error deleting chat");
      };
      
      // Ensure database connection is closed when transaction completes
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in deleteChat:', error);
    throw error;
  }
};

// Clear all messages for a specific chat
export const clearMessagesForChat = async (chatId: string): Promise<void> => {
  try {
    console.log(`Clearing messages for chat ID: ${chatId}`);
    const db = await connectToDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(MESSAGES_STORE, 'readwrite');
      const store = transaction.objectStore(MESSAGES_STORE);
      const index = store.index('chatId');
      const request = index.openCursor(IDBKeyRange.only(chatId));
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
        
        if (cursor) {
          // Delete this message
          cursor.delete();
          // Move to next message
          cursor.continue();
        }
      };
      
      transaction.oncomplete = () => {
        console.log(`Successfully cleared all messages for chat ${chatId}`);
        db.close();
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Error clearing messages:', event);
        db.close();
        reject(`Error in transaction: ${transaction.error?.message || 'Unknown error'}`);
      };
    });
  } catch (error) {
    console.error('Error in clearMessagesForChat:', error);
    throw error;
  }
};