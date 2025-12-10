import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import CallInterface from './components/CallInterface';
import StatusViewer from './components/StatusViewer';
import { User, Chat, Story, CallLog, ViewState } from './types';
import { INITIAL_CHATS, ME_USER, MOCK_USERS, MOCK_STORIES, MOCK_CALLS } from './constants';
import { sendMessageToAI } from './services/geminiService';

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('chats');
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [calls, setCalls] = useState<CallLog[]>(MOCK_CALLS);
  
  // Transient UI states
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeCall, setActiveCall] = useState<{user: User, type: 'audio' | 'video'} | null>(null);

  const activeChat = activeChatId ? chats.find(c => c.id === activeChatId) || null : null;

  const handleSendMessage = async (chatId: string, text: string, type: 'text' | 'image' | 'audio' | 'file') => {
    const newMessage = {
      id: `m-${Date.now()}`,
      senderId: ME_USER.id,
      text,
      timestamp: new Date(),
      type,
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newMessage,
        };
      }
      return chat;
    }));

    // Check if chatting with AI
    const chat = chats.find(c => c.id === chatId);
    const isAIChat = chat?.participants.some(p => p.id === 'ai-assistant');

    if (isAIChat) {
      // Create a placeholder message for AI
      const aiMessageId = `ai-${Date.now()}`;
      const placeholder: any = {
        id: aiMessageId,
        senderId: 'ai-assistant',
        text: '...', // typing indicator
        timestamp: new Date(),
        type: 'text',
      };

      // Add placeholder
      setChats(prev => prev.map(c => 
        c.id === chatId 
        ? { ...c, messages: [...c.messages, placeholder] } 
        : c
      ));

      // Get stream
      const stream = await sendMessageToAI(chatId, text, chat?.messages || []);
      
      let accumulatedText = "";

      for await (const chunk of stream) {
        accumulatedText += chunk;
        setChats(prev => prev.map(c => {
          if (c.id === chatId) {
            const updatedMessages = c.messages.map(m => 
              m.id === aiMessageId ? { ...m, text: accumulatedText } : m
            );
            return { ...c, messages: updatedMessages, lastMessage: { ...placeholder, text: accumulatedText } };
          }
          return c;
        }));
      }
    }
  };

  const handleStartCall = (userId: string, type: 'audio' | 'video') => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setActiveCall({ user, type });
    }
  };

  const handleEndCall = () => {
      if (activeCall) {
          const newCallLog: CallLog = {
              id: `c-${Date.now()}`,
              userId: activeCall.user.id,
              type: activeCall.type,
              direction: 'outgoing',
              timestamp: new Date(),
              duration: 45 // mock duration
          }
          setCalls(prev => [newCallLog, ...prev]);
      }
      setActiveCall(null);
  }

  // Mobile navigation helper
  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    // On mobile, this view change isn't needed if we use CSS to show/hide, 
    // but typically we'd just ensure the UI reflects active chat.
  };

  const handleBackToSidebar = () => {
    setActiveChatId(null);
  };

  const handleViewStory = (story: Story) => {
      setActiveStory(story);
      // Mark as viewed
       setStories(prev => prev.map(s => s.id === story.id ? { ...s, viewed: true } : s));
  };

  const handleNextStory = () => {
      if (!activeStory) return;
      const currentIndex = stories.findIndex(s => s.id === activeStory.id);
      if (currentIndex < stories.length - 1) {
          handleViewStory(stories[currentIndex + 1]);
      } else {
          setActiveStory(null);
      }
  };

   const handlePrevStory = () => {
      if (!activeStory) return;
      const currentIndex = stories.findIndex(s => s.id === activeStory.id);
      if (currentIndex > 0) {
          handleViewStory(stories[currentIndex - 1]);
      } else {
          setActiveStory(null);
      }
  };


  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar - Hidden on mobile if chat is active */}
      <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} h-full flex-shrink-0 z-20`}>
         <Sidebar 
            currentView={currentView}
            setView={setCurrentView}
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={handleChatSelect}
            stories={stories}
            calls={calls}
            onViewStory={handleViewStory}
            onStartCall={handleStartCall}
         />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full relative ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
         {currentView === 'chats' ? (
             <ChatWindow 
                chat={activeChat}
                currentUser={ME_USER}
                onSendMessage={handleSendMessage}
                onStartCall={handleStartCall}
                onBack={handleBackToSidebar}
             />
         ) : (
            // Placeholder for other views on desktop right panel
             <div className="hidden md:flex flex-1 items-center justify-center bg-slate-950 text-slate-600">
                <div className="text-center">
                    <h3 className="text-2xl font-light mb-2">meChat Web</h3>
                    <p>Select a conversation to start chatting</p>
                </div>
             </div>
         )}
      </div>

      {/* Overlays */}
      {activeCall && (
          <CallInterface 
            user={activeCall.user} 
            type={activeCall.type} 
            onEndCall={handleEndCall} 
          />
      )}

      {activeStory && (
          <StatusViewer 
            story={activeStory} 
            onClose={() => setActiveStory(null)} 
            onNext={handleNextStory} 
            onPrev={handlePrevStory} 
          />
      )}
    </div>
  );
};

export default App;