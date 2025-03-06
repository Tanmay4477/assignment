"use client";

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import supabase from '@/utils/supabaseClient';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  tags: { id: string, name: string; color: string }[];
  unreadCount?: number;
  isPinned?: boolean;
  mentions?: number;
}

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string | null;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchChats = async () => {
      setLoading(true);
      
      // Get all chats the user is part of
      const { data: chatParticipants, error: participantsError } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('user_id', user.id);
        
      if (participantsError) {
        console.log('Error fetching chat participants:', participantsError);
        setLoading(false);
        return;
      }
      
      if (!chatParticipants || chatParticipants.length === 0) {
        setLoading(false);
        return;
      }
      
      const chatIds = chatParticipants.map(cp => cp.chat_id);
      
      // Get chat details
      const { data: chatData, error: chatsError } = await supabase
        .from('chats')
        .select(`
          id,
          name,
          is_group,
          updated_at,
          chat_participants!inner(
            user_id,
            users:user_id(id, full_name, avatar_url, phone)
          ),
          chat_tags(id, name, color)
        `)
        .in('id', chatIds)
        .order('updated_at', { ascending: false });
      
      if (chatsError || !chatData) {
        console.error('Error fetching chats:', chatsError);
        setLoading(false);
        return;
      }

      // Get last message for each chat
      const chatMessages = await Promise.all(chatData.map(async (chat) => {
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            user_id,
            users:user_id(full_name)
          `)
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (messagesError) {
          console.error(`Error fetching messages for chat ${chat.id}:`, messagesError);
          return { chat, lastMessage: null };
        }
        
        return { chat, lastMessage: messages && messages.length > 0 ? messages[0] : null };
      }));

      // Get unread message counts
      const chatUnreadCounts = await Promise.all(chatData.map(async (chat) => {
        const { data: unreadMessages, error: unreadError } = await supabase
          .from('messages')
          .select(`
            id,
            message_status!inner(status, user_id)
          `)
          .eq('chat_id', chat.id)
          .not('user_id', 'eq', user.id)
          .filter('message_status.user_id', 'eq', user.id)
          .filter('message_status.status', 'neq', 'read');
          
        if (unreadError) {
          console.error(`Error fetching unread count for chat ${chat.id}:`, unreadError);
          return { chatId: chat.id, count: 0 };
        }
        
        return { chatId: chat.id, count: unreadMessages ? unreadMessages.length : 0 };
      }));
      
      // Format chat data for display
      const formattedChats = chatMessages.map(({ chat, lastMessage }) => {
        const unreadData = chatUnreadCounts.find(uc => uc.chatId === chat.id);
        const unreadCount = unreadData ? unreadData.count : 0;
        
        // Get chat name (for non-group chats, use other participants' names)
        let chatName = chat.name;
        if (!chatName && chat.chat_participants) {
          const otherParticipants = chat.chat_participants
            .filter(p => p.user_id !== user.id)
            .map(p => p.users);
          
          chatName = otherParticipants.map(p => p.full_name).join(', ');
        }
        
        // Get chat avatar
        let avatar = '';
        if (!chat.is_group && chat.chat_participants) {
          const otherParticipant = chat.chat_participants.find(p => p.user_id !== user.id);
          if (otherParticipant && otherParticipant.users.avatar_url) {
            avatar = otherParticipant.users.avatar_url;
          }
        }
        
        return {
          id: chat.id,
          name: chatName || 'Unnamed Chat',
          lastMessage: lastMessage ? 
            `${lastMessage.users?.full_name || 'Unknown'}: ${lastMessage.content}` : 
            'No messages yet',
          time: lastMessage ? 
            formatMessageTime(lastMessage.created_at) : 
            formatMessageTime(chat.updated_at),
          avatar: avatar,
          tags: chat.chat_tags || [],
          unreadCount: unreadCount > 0 ? unreadCount : undefined
        };
      });
      
      setChats(formattedChats);
      setLoading(false);
    };
    
    fetchChats();
    
    // Set up real-time subscription for new messages
    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, () => {
        fetchChats();
      })
      .subscribe();
      
    // Subscribe to message status changes
    const statusSubscription = supabase
      .channel('public:message_status')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'message_status'
      }, () => {
        fetchChats();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(messageSubscription);
      supabase.removeChannel(statusSubscription);
    };
  }, [user]);

  // Format timestamp for display
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show date without year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Get avatar fallback (initials) when no avatar image
  const getAvatarFallback = (name: string) => {
    const initials = name.split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    return initials;
  };

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      {/* Search and Filter Bar */}
      <div className="p-2 border-b border-gray-200 flex space-x-2">
        <button className="flex items-center space-x-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-md text-sm">
          <Filter size={16} />
          <span>Custom filter</span>
        </button>
        <button className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-sm">
          Save
        </button>
        <div className="flex-1 relative ml-2">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
        <button className="bg-gray-100 text-green-600 px-3 py-1.5 rounded-md text-sm flex items-center space-x-1">
          <Filter size={16} />
          <span>Filtered</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No chats match your search' : 'No chats yet'}
          </div>
        ) : (
          filteredChats.map(chat => (
            <div 
              key={chat.id} 
              className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                selectedChatId === chat.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-start">
                {/* Avatar */}
                <div className="relative mr-3 mt-1">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {chat.avatar ? (
                      <div className="relative h-full w-full">
                        <img 
                          src={chat.avatar} 
                          alt={chat.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // If image fails to load, show fallback
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-lg font-medium text-gray-600">
                          {getAvatarFallback(chat.name)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-lg font-medium text-gray-600">
                        {getAvatarFallback(chat.name)}
                      </span>
                    )}
                  </div>
                  {chat.unreadCount && (
                    <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {chat.unreadCount}
                    </div>
                  )}
                  {chat.isPinned && (
                    <div className="absolute top-0 left-0 bg-blue-500 w-3 h-3 rounded-full"></div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-1">{chat.lastMessage}</p>
                  
                  <div className="flex items-center mt-1">
                    {chat.mentions && (
                      <span className="text-xs text-gray-500 mr-1">+{chat.mentions}</span>
                    )}
                    <div className="flex space-x-1">
                      {chat.tags.map((tag) => (
                        <span 
                          key={tag.id} 
                          className={`text-xs px-2 py-0.5 rounded-md`}
                          style={{
                            backgroundColor: `${tag.color}20`, // 20% opacity version of the color
                            color: tag.color
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;