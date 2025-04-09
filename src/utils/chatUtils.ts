// Utility functions for chat components

// Format date for display in chat
export const formatDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };
  
  // Get avatar fallback initials from a name
  export const getAvatarFallback = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  // Group messages by date (for this simple example, all messages are from today)
  export const groupMessagesByDate = (messages: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    return { [today]: messages };
  };