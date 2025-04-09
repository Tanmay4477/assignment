import { useRef, useEffect } from 'react';

export const useChatScroll = <T>(dependency: T[]) => {
  // Using null as initial value is correct, but need to ensure type compatibility
  const endRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever dependency changes
  useEffect(() => {
    scrollToBottom();
  }, [dependency]);

  return endRef;
};