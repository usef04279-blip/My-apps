export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: Date;
  phoneNumber?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'audio' | 'video' | 'file';
  mediaUrl?: string;
  reactions?: Record<string, string>; // userId -> emoji
  fileName?: string;
  fileSize?: string;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: Message;
}

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timestamp: Date;
  viewed: boolean;
}

export interface CallLog {
  id: string;
  userId: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: Date;
  duration?: number; // seconds
}

export type ViewState = 'chats' | 'status' | 'calls' | 'settings' | 'camera';

export interface AIConfig {
  thinkingBudget?: number;
}