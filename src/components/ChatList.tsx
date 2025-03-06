"use client";

import { useState } from 'react';
import { Search, ListFilter, Folder } from 'lucide-react';

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

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string | null;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hardcoded chats
  const chats: ChatItem[] = [
    {
      id: 'chat-1',
      name: 'Test Skope Final 5',
      lastMessage: 'Support2: This doesn\'t go on Tuesday...',
      time: 'Yesterday',
      avatar: '',
      tags: [{ id: 'tag1', name: 'Demo', color: '#ff9800' }],
      unreadCount: 4
    },
    {
      id: 'chat-2',
      name: 'Periskope Team Chat',
      lastMessage: 'Periskope: Test message',
      time: '28-Feb-25',
      avatar: '',
      tags: [
        { id: 'tag2', name: 'Demo', color: '#ff9800' },
        { id: 'tag3', name: 'Internal', color: '#4caf50' }
      ],
      mentions: '91 91910101032'
    },
    {
      id: 'chat-3',
      name: '+91 99999 99999',
      lastMessage: 'Hi there, I\'m Swapnika, Co-Founder of ...',
      time: '25-Feb-25',
      avatar: '',
      tags: [
        { id: 'tag4', name: 'Demo', color: '#ff9800' },
        { id: 'tag5', name: 'Signup', color: '#2196f3' }
      ]
    },
    {
      id: 'chat-4',
      name: 'Test Demo 23',
      lastMessage: 'Rohosen: 123',
      time: '25-Feb-25',
      avatar: '',
      tags: [
        { id: 'tag6', name: 'Content', color: '#9c27b0' },
        { id: 'tag7', name: 'Demo', color: '#ff9800' }
      ],
      unreadCount: 4
    },
    {
      id: 'chat-5',
      name: 'Test El Centro',
      lastMessage: 'Roshnag: Hello, Ahmadport!',
      time: '04-Feb-25',
      avatar: '',
      tags: [{ id: 'tag8', name: 'Demo', color: '#ff9800' }]
    },
    {
      id: 'chat-6',
      name: 'Testing group',
      lastMessage: 'Testing 12345',
      time: '27-Jan-25',
      avatar: '',
      tags: [{ id: 'tag9', name: 'Demo', color: '#ff9800' }]
    },
    {
      id: 'chat-7',
      name: 'Yasin 3',
      lastMessage: 'First Bulk Message',
      time: '25-Nov-24',
      avatar: '',
      tags: [
        { id: 'tag10', name: 'Demo', color: '#ff9800' },
        { id: 'tag11', name: 'Dont Send', color: '#f44336' }
      ],
      mentions: '91 99281919101'
    },
    {
      id: 'chat-8',
      name: 'Testing group',
      lastMessage: 'Testing 12345',
      time: '27-Jan-25',
      avatar: '',
      tags: [{ id: 'tag12', name: 'Demo', color: '#ff9800' }],
      unreadCount: 2
    },
    {
      id: 'chat-9',
      name: 'Testing group',
      lastMessage: 'Testing 12345',
      time: '27-Jan-25',
      avatar: '',
      tags: [{ id: 'tag13', name: 'Demo', color: '#ff9800' }]
    },
    {
      id: 'chat-10',
      name: 'Testing group',
      lastMessage: 'Testing 12345',
      time: '27-Jan-25',
      avatar: '',
      tags: [{ id: 'tag14', name: 'Demo', color: '#ff9800' }]
    },
    {
      id: 'chat-11',
      name: 'Testing group',
      lastMessage: 'Testing 12345',
      time: '27-Jan-25',
      avatar: '',
      tags: [{ id: 'tag15', name: 'Demo', color: '#ff9800' }]
    },
  ];

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
      <div className="border-b border-gray-200 flex justify-between text-sm tracking-tighter p-2">
        <div className='flex justify-normal gap-2'>
          <button className="flex items-center gap-1 font-bold text-green-600 rounded-md text-sm">
            <Folder size={16} className='' />
            <div className='text-sm tracking-tight'>Custom filter</div>
          </button>
          <button className="bg-gray-100 text-gray-600 rounded-md text-sm p-1">
            Save
          </button>
        </div>
        <div className='flex justify-normal gap-2'>
          <div className="flex justify-normal items-center gap-1 border border-gray-200 rounded-md text-sm text-black p-1 w-20">
            <Search size={12} />
            <input
              type="text"
              placeholder="Search"
              className="w-2/3 outline-none focus:outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-gray-100 text-green-600 rounded-md text-sm flex items-center gap-1 p-1">
            <ListFilter size={16} />
            <span>Filtered</span>
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
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
                    <span className="text-lg font-medium text-gray-600">
                      {getAvatarFallback(chat.name)}
                    </span>
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
                      <span className="bg-gray-200 p-1 rounded-md text-[8px] text-gray-500 mr-1">+{chat.mentions}</span>
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