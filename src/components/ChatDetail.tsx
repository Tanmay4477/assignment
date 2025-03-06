// components/ChatDetail.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, ArrowDown, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import supabase from '@/utils/supabaseClient';
import MessageInput from './MessageInput';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: string | null;
  senderName: string;
  senderPhone?: string | null;
  isRead: boolean;
  isSent: boolean;
  isDelivered: boolean;
}

interface ChatDetailProps {
  chatId?: string;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatId || !user) return;
    
    const fetchChatDetails = async () => {
      setLoading(true);
      
      // Get chat details
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select(`
          id,
          name,
          is_group,
          chat_participants!inner(
            user_id,
            users:user_id(id, full_name, avatar_url, phone)
          )
        `)
        .eq('id', chatId)
        .single();
        
      if (chatError || !chatData) {
        console.error('Error fetching chat details:', chatError);
        setLoading(false);
        return;
      }
      
      // Format chat info
      const chatName = chatData.name || formatChatName(chatData.chat_participants, user.id);
      const participants = chatData.chat_participants.map((p: any) => p.users);
      
      setChatInfo({
        id: chatData.id,
        name: chatName,
        isGroup: chatData.is_group,
        participants: participants,
      });
      
      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          users:user_id(full_name, phone),
          message_status(status, user_id)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
        
      if (messagesError || !messagesData) {
        console.error('Error fetching messages:', messagesError);
        setLoading(false);
        return;
      }
      
      // Format messages
      const formattedMessages = messagesData.map((msg: any) => {
        // Check message status
        const userStatuses = msg.message_status.filter((status: any) => 
          status.user_id !== user.id
        );
        
        const isRead = userStatuses.some((status: any) => status.status === 'read');
        const isDelivered = userStatuses.some((status: any) => 
          status.status === 'delivered' || status.status === 'read'
        );
        const isSent = true; // Assume sent if it's in the database
        
        return {
          id: msg.id,
          text: msg.content,
          time: formatMessageTime(msg.created_at),
          sender: msg.user_id,
          senderName: msg.users?.full_name || 'Unknown',
          senderPhone: msg.users?.phone,
          isRead,
          isSent,
          isDelivered,
        };
      });
      
      setMessages(formattedMessages);
      setLoading(false);
      
      // Mark messages as read
      markMessagesAsRead(messagesData);
    };
    
    fetchChatDetails();
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel(`chat-${chatId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, payload => {
        // Fetch the complete message with user info
        fetchNewMessage(payload.new.id);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'message_status'
      }, () => {
        // Refresh message status
        fetchChatDetails();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [chatId, user]);
  
  // Fetch a single new message
  const fetchNewMessage = async (messageId: string) => {
    const { data: msgData, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        user_id,
        users:user_id(full_name, phone),
        message_status(status, user_id)
      `)
      .eq('id', messageId)
      .single();
    
    if (error || !msgData) {
      console.error('Error fetching new message:', error);
      return;
    }
    
    // Check message status
    const userStatuses = msgData.message_status.filter((status: any) => 
      status.user_id !== user?.id
    );
    
    const isRead = userStatuses.some((status: any) => status.status === 'read');
    const isDelivered = userStatuses.some((status: any) => 
      status.status === 'delivered' || status.status === 'read'
    );
    
    const newMessage: Message = {
      id: msgData.id,
      text: msgData.content,
      time: formatMessageTime(msgData.created_at),
      sender: msgData.user_id,
      senderName: msgData.users?.full_name || 'Unknown',
      senderPhone: msgData.users?.phone,
      isRead,
      isSent: true,
      isDelivered,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Mark as read if from another user
    if (msgData.user_id !== user?.id) {
      markMessageAsRead(messageId);
    }
  };
  
  // Mark all unread messages as read
  const markMessagesAsRead = async (messagesData: any[]) => {
    if (!user) return;
    
    // Get messages that aren't read by current user
    const messagesToMark = messagesData
      .filter(msg => msg.user_id !== user.id)
      .filter(msg => {
        const userStatus = msg.message_status.find(
          (status: any) => status.user_id === user.id
        );
        return userStatus && userStatus.status !== 'read';
      })
      .map(msg => msg.id);
    
    if (messagesToMark.length === 0) return;
    
    // Update message status
    for (const messageId of messagesToMark) {
      await markMessageAsRead(messageId);
    }
  };
  
  // Mark a single message as read
  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase.rpc('mark_message_as_read', { 
        message_id: messageId 
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (text: string) => {
    if (!chatId || !text.trim() || !user) return;
    
    try {
      const { data, error } = await supabase.rpc(
        'send_message', 
        { chat_id: chatId, content: text }
      );
      
      if (error) throw error;
      
      // The real-time subscription will update the UI
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Format chat name for display
  const formatChatName = (participants: any[], currentUserId: string) => {
    const otherParticipants = participants.filter(
      p => p.user_id !== currentUserId
    );
    return otherParticipants.map(p => p.users.full_name).join(', ');
  };

  // Format timestamp for display
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for display in chat
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const grouped: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      // Extract date part only (no time)
      const dateKey = new Date(new Date(message.time).setHours(0, 0, 0, 0)).toISOString();
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });
    
    return grouped;
  };

  const getAvatarFallback = (name: string) => {
    return name.split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="bg-white p-2 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-gray-600">
                  {chatInfo ? getAvatarFallback(chatInfo.name) : ''}
                </span>
              </div>
              <div>
                <h2 className="text-sm font-medium">{chatInfo?.name}</h2>
                <p className="text-xs text-gray-500">
                  {chatInfo?.participants
                    .map((p: any) => p.full_name)
                    .join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Search size={18} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4" 
            style={{ backgroundImage: 'url("/chat-bg.png")' }}
          >
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="space-y-3">
                <div className="flex justify-center">
                  <div className="bg-white px-3 py-1 rounded-full shadow-sm">
                    <span className="text-xs text-gray-500">
                      {formatDate(date)}
                    </span>
                  </div>
                </div>
                
                {dateMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3/4 rounded-lg px-3 py-2 shadow-sm ${
                      message.sender === user?.id 
                        ? 'bg-green-100 text-gray-800' 
                        : 'bg-white text-gray-800'
                    }`}>
                      {message.sender !== user?.id && (
                        <div className="text-xs font-medium" style={{ color: '#4caf50' }}>
                          {message.senderName}
                          {message.senderPhone && <span className="ml-1 font-normal text-gray-500">{message.senderPhone}</span>}
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <div className="flex justify-end items-center mt-1 space-x-1">
                        <span className="text-xs text-gray-500">{message.time}</span>
                        {message.sender === user?.id && (
                          <div className="flex">
                            <Check size={14} 
                              className={message.isRead ? 'text-blue-500' : 'text-gray-400'} 
                            />
                            <Check size={14} 
                              className={message.isRead ? 'text-blue-500' : 'text-gray-400'} 
                              style={{ marginLeft: -4 }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <MessageInput onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  );
};

export default ChatDetail;