import { User, Chat, Story, CallLog } from './types';

export const ME_USER: User = {
  id: 'me',
  name: 'Alex Design',
  avatar: 'https://picsum.photos/id/64/200/200',
  bio: 'Designing the future 🚀',
  status: 'online',
  phoneNumber: '+1 555 0192'
};

export const MOCK_USERS: User[] = [
  {
    id: 'ai-assistant',
    name: 'meChat AI',
    avatar: 'https://picsum.photos/id/20/200/200',
    bio: 'Always here to help. Powered by Gemini.',
    status: 'online',
  },
  {
    id: 'u1',
    name: 'Sarah Connor',
    avatar: 'https://picsum.photos/id/65/200/200',
    bio: 'No fate but what we make.',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'u2',
    name: 'John Doe',
    avatar: 'https://picsum.photos/id/91/200/200',
    bio: 'At the gym 🏋️',
    status: 'online',
  },
  {
    id: 'u3',
    name: 'Design Team',
    avatar: 'https://picsum.photos/id/180/200/200',
    bio: '',
    status: 'offline',
  },
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'c1',
    participants: [MOCK_USERS[0]], // AI
    messages: [
      {
        id: 'm1',
        senderId: 'ai-assistant',
        text: 'Hello! I am your AI assistant. How can I help you today?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'text',
      }
    ],
    unreadCount: 0,
    isGroup: false,
    lastMessage: {
       id: 'm1',
        senderId: 'ai-assistant',
        text: 'Hello! I am your AI assistant. How can I help you today?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'text',
    }
  },
  {
    id: 'c2',
    participants: [MOCK_USERS[1]],
    messages: [
      {
        id: 'm2',
        senderId: 'u1',
        text: 'Hey Alex, are we still on for lunch?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'text',
      },
      {
        id: 'm3',
        senderId: 'me',
        text: 'Yes! See you at 1pm.',
        timestamp: new Date(Date.now() - 1000 * 60 * 29),
        type: 'text',
      }
    ],
    unreadCount: 0,
    isGroup: false,
     lastMessage: {
        id: 'm3',
        senderId: 'me',
        text: 'Yes! See you at 1pm.',
        timestamp: new Date(Date.now() - 1000 * 60 * 29),
        type: 'text',
      }
  },
  {
    id: 'c3',
    participants: [MOCK_USERS[2]],
    messages: [
      {
        id: 'm4',
        senderId: 'u2',
        text: 'Check out this view!',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        type: 'image',
        mediaUrl: 'https://picsum.photos/id/28/800/600'
      }
    ],
    unreadCount: 1,
    isGroup: false,
    lastMessage: {
       id: 'm4',
        senderId: 'u2',
        text: 'Photo',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        type: 'image',
    }
  },
   {
    id: 'c4',
    participants: [MOCK_USERS[1], MOCK_USERS[2]],
    messages: [],
    unreadCount: 0,
    isGroup: true,
    groupName: "Weekend Trip",
    groupAvatar: "https://picsum.photos/id/10/200/200"
  }
];

export const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    userId: 'u1',
    mediaUrl: 'https://picsum.photos/id/50/600/900',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    viewed: false,
  },
  {
    id: 's2',
    userId: 'u2',
    mediaUrl: 'https://picsum.photos/id/55/600/900',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    viewed: true,
  }
];

export const MOCK_CALLS: CallLog[] = [
  {
    id: 'cl1',
    userId: 'u1',
    type: 'video',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    duration: 124,
  },
  {
    id: 'cl2',
    userId: 'u2',
    type: 'audio',
    direction: 'missed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
  }
];
