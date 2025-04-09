// types/index.ts
export interface ChatItem {
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
  
  export interface Message {
    id: string;
    chatId: string;
    text: string;
    time: string;
    sender: string;
    senderName: string;
    senderPhone?: string;
    isRead: boolean;
    isSent: boolean;
    isDelivered: boolean;
    avatar?: string;
  }