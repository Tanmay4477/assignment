// components/MessageInput.tsx
"use client";

import { useState, useRef } from 'react';
import { 
  Paperclip, 
  Smile, 
  Clock, 
  Calendar, 
  Sparkles, 
  FileText, 
  Mic,
  Send
} from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
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

  return (
    <div className="bg-white border-t border-gray-200 p-2">
      {/* Message options */}
      <div className="flex space-x-2 mb-2">
        <button className="flex items-center space-x-1 px-2 py-1 rounded text-sm text-gray-500 bg-white border border-gray-200 hover:bg-gray-50">
          <span>WhatsApp</span>
        </button>
        
        <button className="flex items-center space-x-1 px-2 py-1 rounded text-sm text-yellow-500 bg-white border border-gray-200 hover:bg-gray-50">
          <span>Private Note</span>
        </button>
      </div>
      
      {/* Input area */}
      <div className="flex items-center bg-white border border-gray-200 rounded-md px-3 py-2">
        <div className="flex space-x-3 mr-3">
          <button className="text-gray-400 hover:text-gray-600">
            <Paperclip size={20} />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Smile size={20} />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Clock size={20} />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Calendar size={20} />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Sparkles size={20} />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <FileText size={20} />
          </button>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Message..."
          className="flex-1 outline-none text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <div className="flex space-x-3 ml-3">
          <button className="text-gray-400 hover:text-gray-600">
            <Mic size={20} />
          </button>
          {message.trim() ? (
            <button 
              className="text-green-500 hover:text-green-600"
              onClick={handleSend}
            >
              <Send size={20} />
            </button>
          ) : (
            <div className="w-5"></div> 
          )}
        </div>
      </div>
      
      <div className="flex justify-end mt-1">
        <div className="flex items-center space-x-1">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs">P</span>
          </div>
          <span className="text-xs text-gray-500">Periskope</span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;