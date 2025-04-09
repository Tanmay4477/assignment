"use client";

import { useState, useRef } from 'react';
import MessageTabs from './MessageTabs';
import MessageToolbar from './MessageToolbar';
import ProviderSelector from './ProviderSelector';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <>
      <MessageTabs 
        isExpanded={isExpanded} 
        onToggle={toggleExpanded} 
      />
      
      <div className="relative bg-white border-t border-gray-200 p-2">
        <div className='flex justify-around p-2 pb-6'>
          <input
            ref={inputRef}
            type="text"
            placeholder="Message..."
            className="flex-1 outline-none text-sm text-gray-600"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <div className="flex space-x-3 ml-3">
            {message.trim() && (
              <button 
                className="text-green-500 hover:text-green-600"
                onClick={handleSend}
                aria-label="Send message"
              >
                <SendHorizontalIcon />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center bg-white border border-gray-200 rounded-md px-3 py-2 justify-between">
          <MessageToolbar />
          <ProviderSelector />
        </div>
      </div>
    </>
  );
};

// Icon component for cleaner JSX
const SendHorizontalIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M3 3l3 9-3 9 19-9z" />
    <path d="M8 12h16" />
  </svg>
);

export default MessageInput;