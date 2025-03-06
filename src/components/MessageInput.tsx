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
  ChevronsUpDown,
  SendHorizontal,
  CircleChevronDown,
  EllipsisVertical,
  CircleChevronUp
} from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isWhatsapp, setIsWhatsapp] = useState<boolean>(true);
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

  const chevronClicked = () => {
    setIsWhatsapp((prevState) => !prevState)
  }

  return (
    <>
      {isWhatsapp ? <div className="flex justify-start items-center gap-1 pl-4">
      <button onClick={chevronClicked}>  <CircleChevronDown size={12} color="gray"/> </button>
      <button className="flex gap-1 items-center px-3 py-1 rounded-t-lg text-xs text-green-500 font-bold bg-white border border-gray-200 hover:bg-gray-50">
        <span>WhatsApp</span>
        <EllipsisVertical size={8}/>
      </button>
      
      <button className="flex gap-1 items-center px-3 py-1 rounded-t-lg text-xs text-yellow-500 font-bold bg-white border border-gray-200 hover:bg-gray-50">
        <span>Private Note</span>
        <EllipsisVertical size={8} />
      </button>


    </div> :
    <div className="flex justify-start items-center gap-1 pl-4">
      <button onClick={chevronClicked}>  <CircleChevronUp size={12} color="gray"/> </button>
    </div>
    }
  
    <div className="relative bg-white border-t border-gray-200 p-2">
      {/* Message options */}
      {/* <div className="flex space-x-2 mb-2">
        <button className="flex items-center space-x-1 px-2 py-1 rounded text-sm text-gray-500 bg-white border border-gray-200 hover:bg-gray-50">
          <span>WhatsApp</span>
        </button>
        
        <button className="flex items-center space-x-1 px-2 py-1 rounded text-sm text-yellow-500 bg-white border border-gray-200 hover:bg-gray-50">
          <span>Private Note</span>
        </button>
      </div> */}



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
              {message.trim() ? (
                <button 
                  className="text-green-500 hover:text-green-600"
                  onClick={handleSend}
                >
                  <SendHorizontal size={20} />
                </button>
              ) : (
                <div className="w-5"></div> 
              )}
          </div>
        </div>
      
      {/* Input area */}
      <div className="flex items-center bg-white border border-gray-200 rounded-md px-3 py-2 justify-between">
        <div className="flex space-x-5 mr-3">
          <button className="text-gray-700 hover:text-gray-900">
            <Paperclip size={16} />
          </button>
          <button className="text-gray-500 hover:text-gray-600">
            <Smile size={16} />
          </button>
          <button className="text-gray-500 hover:text-gray-600">
            <Clock size={16} />
          </button>
          <button className="text-gray-500 hover:text-gray-600">
            <Calendar size={16} />
          </button>
          <button className="text-gray-700 hover:text-gray-900">
            <Sparkles size={16} />
          </button>
          <button className="text-gray-700 hover:text-gray-900">
            <FileText size={16} />
          </button>
          <button className="text-gray-800 hover:text-gray-800">
            <Mic size={16} />
          </button>
        </div>

        <div className='flex justify-between items-center outline p-0.5 rounded-md w-32'>
          <div className='flex justify-start items-center gap-1'>
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-4 w-4"
              // If your logo isn't circular, remove the rounded-full class
              // className="h-8 w-8 rounded-full" 
            />
            <p className='text-xs text-gray-700'>Periskope</p>
          </div>
          <ChevronsUpDown size={12} color='gray'/>
        </div>
        

        

      </div>
      
      {/* <div className="flex justify-end mt-1">
        <div className="flex items-center space-x-1">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs">P</span>
          </div>
          <span className="text-xs text-gray-500">Periskope</span>
        </div>
      </div> */}
    </div>
  </>
  );
};

export default MessageInput;