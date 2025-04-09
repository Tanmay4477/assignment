'use client'

import React from 'react';
import { Search, X } from 'lucide-react';

interface ChatSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ChatSearchBar: React.FC<ChatSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const clearSearch = () => {
    onChange('');
  };

  return (
    <div className={`flex items-center gap-1 border border-gray-200 rounded-md text-sm text-black p-1 ${className}`}>
      <Search size={12} className="text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 outline-none focus:outline-none text-xs"
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button 
          onClick={clearSearch}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

export default ChatSearchBar;