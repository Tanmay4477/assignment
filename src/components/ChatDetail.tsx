"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, Check, Sparkles } from 'lucide-react';
import MessageInput from './MessageInput';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: string;
  senderName: string;
  senderPhone?: string;
  isRead: boolean;
  isSent: boolean;
  isDelivered: boolean;
  avatar?: string; // Add avatar field for sender's profile picture
}

interface ChatDetailProps {
  chatId?: string;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chatInfo, setChatInfo] = useState<any>(null); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set hardcoded data based on the selected chatId
  useEffect(() => {
    if (!chatId) return;

    // Define all our hardcoded chats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatsData: Record<string, any> = {

      'chat-1': {
        name: 'Test Skope Final 5',
        participants: [
          { id: 'user1', full_name: 'Support2', phone: '+91 99718 44008' },
          { id: 'user2', full_name: 'Roshnag Airtel', phone: '+91 99718 44008' }
        ],
        messages: [
          {
            id: '1',
            text: 'Hi there! Welcome to the chat.',
            time: '11:30',
            sender: 'user1',
            senderName: 'Support2',
            senderPhone: '+91 99718 44008',
            isRead: true,
            isSent: true,
            isDelivered: true
          },
          {
            id: '2',
            text: 'This doesn\'t go on Tuesday...',
            time: '11:45',
            sender: 'user1',
            senderName: 'Support2',
            senderPhone: '+91 99718 44008',
            isRead: true,
            isSent: true,
            isDelivered: true
          },
          {
            id: '3',
            text: 'I understand. When would be a good time?',
            time: '12:00',
            sender: 'current-user',
            senderName: 'You',
            senderPhone: '+91 98765 43210',
            isRead: true,
            isSent: true,
            isDelivered: true
          },
          {
            id: '4',
            text: 'Maybe Thursday?',
            time: '12:05',
            sender: 'current-user',
            senderName: 'You',
            senderPhone: '+91 98765 43210',
            isRead: false,
            isSent: true,
            isDelivered: true
          }
        ]
      },
    
      'chat-2': {
        name: 'Periskope Team Chat',
        participants: [
          { id: 'user3', full_name: 'Periskope', phone: '+91 99718 44008' },
          { id: 'user4', full_name: 'Bharat Kumar Ramesh', phone: '+91 98765 11111' },
          { id: 'user5', full_name: 'Roshnag Jio', phone: '+91 98765 22222' }
        ],
        messages: [
          {
            id: '1',
            text: 'Welcome to the Periskope team!',
            time: '10:00',
            sender: 'user3',
            senderName: 'Periskope',
            senderPhone: '+91 99718 44008',
            isRead: true,
            isSent: true,
            isDelivered: true
          },
          {
            id: '2',
            text: 'Thanks for having me',
            time: '10:15',
            sender: 'current-user',
            senderName: 'You',
            senderPhone: '+91 98765 43210',
            isRead: true,
            isSent: true,
            isDelivered: true
          },
          {
            id: '3',
            text: 'When is our next meeting?',
            time: '10:30',
            sender: 'user4',
            senderName: 'Bharat Kumar Ramesh',
            senderPhone: '+91 98765 11111',
            isRead: true,
            isSent: true,
            isDelivered: true
          },
          {
            id: '4',
            text: 'Test message',
            time: '11:00',
            sender: 'user3',
            senderName: 'Periskope',
            senderPhone: '+91 99718 44008',
            isRead: true,
            isSent: true,
            isDelivered: true
          }
        ]
      },
    
      'chat-3': {
        name: 'Office Chat',
        participants: [
          { id: 'user5', full_name: 'Ethan Miller', phone: '+91 98765 33333' },
          { id: 'user6', full_name: 'Fiona Clark', phone: '+61 4800 12345' }
        ],
        messages: [
          {
            id: '1',
            text: 'The report is ready for review.',
            time: '14:32',
            sender: 'user5',
            senderName: 'Ethan Miller',
            senderPhone: '+91 98765 33333',
            isRead: true,
            isSent: true,
            isDelivered: true
          },
          {
            id: '2',
            text: 'Great, I’ll check it now.',
            time: '14:34',
            sender: 'user6',
            senderName: 'Fiona Clark',
            senderPhone: '+61 4800 12345',
            isRead: true,
            isSent: true,
            isDelivered: true
          }
        ]
      },
    
      'chat-4': {
        name: 'Gaming Squad',
        participants: [
          { id: 'user7', full_name: 'George Parker', phone: '+91 98765 44444' },
          { id: 'user8', full_name: 'Hannah Lee', phone: '+91 98765 55555' }
        ],
        messages: [
          {
            id: '1',
            text: 'Who’s up for a gaming session?',
            time: '20:00',
            sender: 'user7',
            senderName: 'George Parker',
            senderPhone: '+91 98765 44444',
            isRead: true,
            isSent: true,
            isDelivered: true
          },
          {
            id: '2',
            text: 'I’m in! Let’s go.',
            time: '20:05',
            sender: 'user8',
            senderName: 'Hannah Lee',
            senderPhone: '+91 98765 55555',
            isRead: true,
            isSent: true,
            isDelivered: true
          }
        ]
      },
    
      'chat-5': {
        name: 'Test El Centro',
        participants: [
          { id: 'user2', full_name: 'Roshnag Airtel', phone: '+91 63648 47925' },
          { id: 'user5', full_name: 'Roshnag Jio', phone: '+91 98765 22222' },
          { id: 'user4', full_name: 'Bharat Kumar Ramesh', phone: '+91 98765 11111' },
          { id: 'user3', full_name: 'Periskope', phone: '+91 99718 44008' }
        ],
        messages: [
          {
            id: '1',
            text: 'CVFER',
            time: '11:51',
            sender: 'user2',
            senderName: 'Roshnag Airtel',
            senderPhone: '+91 63648 47925',
            isRead: true,
            isSent: true,
            isDelivered: true
          }
        ]
      },
        'chat-6': {
          name: 'Project X Discussion',
          participants: [
            { id: 'user9', full_name: 'Alice Johnson', phone: '+91 98765 66666' },
            { id: 'user10', full_name: 'Bob Williams', phone: '+91 98765 77777' }
          ],
          messages: [
            {
              id: '1',
              text: 'Have you reviewed the project proposal?',
              time: '09:15',
              sender: 'user9',
              senderName: 'Alice Johnson',
              senderPhone: '+91 98765 66666',
              isRead: true,
              isSent: true,
              isDelivered: true
            },
            {
              id: '2',
              text: 'Yes, I think it looks solid.',
              time: '09:20',
              sender: 'user10',
              senderName: 'Bob Williams',
              senderPhone: '+91 98765 77777',
              isRead: true,
              isSent: true,
              isDelivered: true
            }
          ]
        },
      
        'chat-7': {
          name: 'Weekend Plans',
          participants: [
            { id: 'user11', full_name: 'Charlie Brown', phone: '+91 98765 88888' },
            { id: 'user12', full_name: 'Diana Prince', phone: '+91 98765 99999' }
          ],
          messages: [
            {
              id: '1',
              text: 'Are we still on for the beach trip?',
              time: '16:45',
              sender: 'user11',
              senderName: 'Charlie Brown',
              senderPhone: '+91 98765 88888',
              isRead: true,
              isSent: true,
              isDelivered: true
            },
            {
              id: '2',
              text: 'Absolutely! I can’t wait.',
              time: '16:50',
              sender: 'user12',
              senderName: 'Diana Prince',
              senderPhone: '+91 98765 99999',
              isRead: true,
              isSent: true,
              isDelivered: true
            }
          ]
        },
      
        'chat-8': {
          name: 'Family Group',
          participants: [
            { id: 'user13', full_name: 'Emily Clark', phone: '+91 98765 10101' },
            { id: 'user14', full_name: 'Frank Adams', phone: '+91 98765 20202' }
          ],
          messages: [
            {
              id: '1',
              text: 'Dinner at 7 PM works?',
              time: '18:00',
              sender: 'user13',
              senderName: 'Emily Clark',
              senderPhone: '+91 98765 10101',
              isRead: true,
              isSent: true,
              isDelivered: true
            },
            {
              id: '2',
              text: 'Perfect! I’ll bring dessert.',
              time: '18:05',
              sender: 'user14',
              senderName: 'Frank Adams',
              senderPhone: '+91 98765 20202',
              isRead: true,
              isSent: true,
              isDelivered: true
            }
          ]
        },
      
        'chat-9': {
          name: 'Coding Buddies',
          participants: [
            { id: 'user15', full_name: 'Grace Hopper', phone: '+91 98765 30303' },
            { id: 'user16', full_name: 'Alan Turing', phone: '+91 98765 40404' }
          ],
          messages: [
            {
              id: '1',
              text: 'Stuck on this algorithm again...',
              time: '21:30',
              sender: 'user15',
              senderName: 'Grace Hopper',
              senderPhone: '+91 98765 30303',
              isRead: true,
              isSent: true,
              isDelivered: true
            },
            {
              id: '2',
              text: 'Let’s debug it together.',
              time: '21:35',
              sender: 'user16',
              senderName: 'Alan Turing',
              senderPhone: '+91 98765 40404',
              isRead: true,
              isSent: true,
              isDelivered: true
            }
          ]
        },
      
        'chat-10': {
          name: 'Fitness Motivation',
          participants: [
            { id: 'user17', full_name: 'Ivy Green', phone: '+91 98765 50505' },
            { id: 'user18', full_name: 'Jack White', phone: '+91 98765 60606' }
          ],
          messages: [
            {
              id: '1',
              text: 'Did you finish today’s workout?',
              time: '07:00',
              sender: 'user17',
              senderName: 'Ivy Green',
              senderPhone: '+91 98765 50505',
              isRead: true,
              isSent: true,
              isDelivered: true
            },
            {
              id: '2',
              text: 'Yes! Feeling great.',
              time: '07:10',
              sender: 'user18',
              senderName: 'Jack White',
              senderPhone: '+91 98765 60606',
              isRead: true,
              isSent: true,
              isDelivered: true
            }
          ]
        },
      
        'chat-11': {
          name: 'Startup Ideas',
          participants: [
            { id: 'user19', full_name: 'Kara Danvers', phone: '+91 98765 70707' },
            { id: 'user20', full_name: 'Bruce Wayne', phone: '+91 98765 80808' }
          ],
          messages: [
            {
              id: '1',
              text: 'I have a new app concept!',
              time: '13:20',
              sender: 'user19',
              senderName: 'Kara Danvers',
              senderPhone: '+91 98765 70707',
              isRead: true,
              isSent: true,
              isDelivered: true
            },
            {
              id: '2',
              text: 'Tell me more. Im interested.',
              time: '13:25',
              sender: 'user20',
              senderName: 'Bruce Wayne',
              senderPhone: '+91 98765 80808',
              isRead: true,
              isSent: true,
              isDelivered: true
            }
          ]
        }
    };
    
    // Use default data for any chatId that isn't explicitly defined
    const defaultChat = {
      name: `Chat ${chatId?.split('-').pop()}`,
      participants: [
        { id: 'demo-user', full_name: 'Demo User', phone: '+91 99999 99999', avatar: '/avatars/default.png' }
      ],
      messages: [
        {
          id: '1',
          text: 'Welcome to this chat!',
          time: '12:00',
          sender: 'demo-user',
          senderName: 'Demo User',
          senderPhone: '+91 99999 99999',
          isRead: true,
          isSent: true,
          isDelivered: true,
          avatar: '/avatars/default.png'
        }
      ]
    };

    // Get chat data or use default
    const chatData = chatsData[chatId] || defaultChat;
    
    // Set chat info
    setChatInfo({
      id: chatId,
      name: chatData.name,
      isGroup: chatData.participants.length > 2,
      participants: chatData.participants
    });

    // Process messages to handle current user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processedMessages = chatData.messages.map((msg: any) => ({
      ...msg,
      sender: msg.sender === 'current-user' ? 'current-user' : msg.sender
    }));

    // Set the messages
    setMessages(processedMessages);
  }, [chatId]);

  // Handle sending a new message
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'current-user',
      senderName: 'You',
      isRead: false,
      isSent: true,
      isDelivered: false
    };

    setMessages([...messages, newMessage]);
  };

  // Format date for display in chat
  const formatDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  // Group messages by date (for this example, all messages are from today)
  const groupMessagesByDate = () => {
    const today = new Date().toISOString().split('T')[0];
    return { [today]: messages };
  };

  const getAvatarFallback = (name: string) => {
    return name.split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const groupedMessages = groupMessagesByDate();

  // If no chat is selected
  if (!chatId || !chatInfo) {
    return (
      <div className="flex flex-col h-full bg-gray-50 items-center justify-center">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Select a chat to start messaging</h3>
          <p className="text-sm text-gray-500">Choose a conversation from the list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white p-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-gray-600">
              {getAvatarFallback(chatInfo.name)}
            </span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-black">{chatInfo.name}</h2>
            <p className="text-xs text-gray-500">
              {chatInfo.participants
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((p: any) => p.full_name)
                .join(', ')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Sparkles size={14} className="text-gray-600 font-bold" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Search size={14} className="text-gray-600 font-bold" />
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
                  {formatDate()}
                </span>
              </div>
            </div>
            
            {dateMessages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'current-user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar for other users' messages */}
                {message.sender !== 'current-user' && (
                  <div className="mr-2 self-start mt-1">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {message.avatar ? (
                        <div className="relative h-full w-full">
                          <img 
                            src={message.avatar} 
                            alt={message.senderName}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // If image fails to load, show fallback
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-600">
                            {getAvatarFallback(message.senderName)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {getAvatarFallback(message.senderName)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className={`max-w-xs sm:max-w-sm md:max-w-md rounded-lg px-3 py-2 shadow-sm ${
                  message.sender === 'current-user'
                    ? 'bg-green-100 text-gray-800'
                    : 'bg-white text-gray-800'
                }`}>
                  {message.sender !== 'current-user' && (
                    <div className="text-xs font-medium min-w-44 flex justify-between" style={{ color: '#4caf50' }}>
                      {message.senderName}
                      {message.senderPhone && <span className="text-[10px] text-gray-300 font-medium">{message.senderPhone}</span>}
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <div className="flex justify-end items-center mt-1 space-x-1">
                    <span className="text-xs text-gray-500">{message.time}</span>
                    {message.sender === 'current-user' && (
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
    </div>
  );
};

export default ChatDetail;