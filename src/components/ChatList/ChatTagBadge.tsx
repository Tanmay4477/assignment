'use client'

import React from 'react';
import { Tag } from '@/types/chat';
import { getLightColor } from '@/utils/formatters';

interface ChatTagBadgeProps {
  tag: Tag;
  onClick?: (tagName: string) => void;
  isActive?: boolean;
  size?: 'xs' | 'sm' | 'md';
}

const ChatTagBadge: React.FC<ChatTagBadgeProps> = ({
  tag,
  onClick,
  isActive = false,
  size = 'xs'
}) => {
  const sizeClass = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-sm px-2 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  const handleClick = () => {
    if (onClick) {
      onClick(tag.name);
    }
  };

  return (
    <span 
      className={`rounded-md ${sizeClass[size]} ${onClick ? 'cursor-pointer' : ''} transition-colors`}
      style={{
        backgroundColor: isActive ? getLightColor(tag.color, 40) : getLightColor(tag.color, 20),
        color: tag.color,
        borderWidth: isActive ? '1px' : '0',
        borderColor: tag.color,
        borderStyle: 'solid'
      }}
      onClick={handleClick}
    >
      {tag.name}
    </span>
  );
};

export default ChatTagBadge;