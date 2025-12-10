import React, { useState } from 'react';
import { MessageSquare, Phone, CircleDashed, Settings, Search, User as UserIcon, LogOut, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { User, Chat, Story, CallLog, ViewState } from '../types';
import { ME_USER, MOCK_USERS } from '../constants';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  stories: Story[];
  calls: CallLog[];
  onViewStory: (story: Story) => void;
  onStartCall: (userId: string, type: 'audio' | 'video') => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setView,
  chats,
  activeChatId,
  onSelectChat,
  stories,
  calls,
  onViewStory,
  onStartCall
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const renderHeader = () => (
    <div className="p-4 border-b border-slate-700 bg-slate-900 sticky top-0 z-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <img
            src={ME_USER.avatar}
            alt="My Profile"
            className="w-10 h-10 rounded-full border-2 border-neon-accent object-cover"
          />
          <div>
            <h3 className="font-bold text-slate-100">{ME_USER.name}</h3>
            <span className="text-xs text-neon-accent">Online</span>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setView('settings')} className={`p-2 rounded-full hover:bg-slate-800 transition ${currentView === 'settings' ? 'text-neon-primary' : 'text-slate-400'}`}>
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-neon-primary text-sm"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setView('chats')}
          className={`flex-1 flex justify-center py-2 border-b-2 transition ${
            currentView === 'chats'
              ? 'border-neon-primary text-neon-primary'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare size={22} />
        </button>
        <button
          onClick={() => setView('status')}
          className={`flex-1 flex justify-center py-2 border-b-2 transition ${
            currentView === 'status'
              ? 'border-neon-secondary text-neon-secondary'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CircleDashed size={22} />
        </button>
        <button
          onClick={() => setView('calls')}
          className={`flex-1 flex justify-center py-2 border-b-2 transition ${
            currentView === 'calls'
              ? 'border-neon-accent text-neon-accent'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Phone size={22} />
        </button>
      </div>
    </div>
  );

  const renderChats = () => {
    const filteredChats = chats.filter(chat => {
      const name = chat.isGroup ? chat.groupName : chat.participants.find(p => p.id !== ME_USER.id)?.name;
      return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => {
          const otherParticipant = chat.participants.find(p => p.id !== ME_USER.id) || chat.participants[0];
          const name = chat.isGroup ? chat.groupName : otherParticipant.name;
          const avatar = chat.isGroup ? chat.groupAvatar : otherParticipant.avatar;
          const isActive = chat.id === activeChatId;

          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center p-4 cursor-pointer hover:bg-slate-800/50 transition border-l-4 ${
                isActive ? 'bg-slate-800 border-neon-primary' : 'border-transparent'
              }`}
            >
              <div className="relative">
                <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
                {!chat.isGroup && otherParticipant.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-neon-accent rounded-full border-2 border-slate-900"></div>
                )}
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-slate-200 truncate">{name}</h4>
                  {chat.lastMessage && (
                     <span className="text-xs text-slate-500">
                      {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-slate-400 truncate w-4/5">
                    {chat.lastMessage 
                      ? (chat.lastMessage.type === 'text' ? chat.lastMessage.text : `Sent a ${chat.lastMessage.type}`) 
                      : 'Start a conversation'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-neon-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStatus = () => (
    <div className="flex-1 overflow-y-auto p-4">
      {/* My Status */}
      <div className="flex items-center mb-6 cursor-pointer group">
        <div className="relative">
          <img src={ME_USER.avatar} alt="Me" className="w-14 h-14 rounded-full opacity-80 group-hover:opacity-100 transition object-cover" />
          <div className="absolute bottom-0 right-0 bg-neon-primary text-white rounded-full p-1 border-2 border-slate-900">
             <span className="text-xs font-bold">+</span>
          </div>
        </div>
        <div className="ml-4">
          <h4 className="font-semibold text-slate-200">My Status</h4>
          <p className="text-sm text-slate-500">Tap to add status update</p>
        </div>
      </div>

      <h5 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider">Recent Updates</h5>
      
      {stories.map(story => {
         const user = MOCK_USERS.find(u => u.id === story.userId);
         if (!user) return null;
         
         return (
          <div key={story.id} onClick={() => onViewStory(story)} className="flex items-center mb-4 cursor-pointer hover:bg-slate-800/50 p-2 rounded-lg transition">
            <div className={`p-0.5 rounded-full border-2 ${story.viewed ? 'border-slate-600' : 'border-neon-secondary'}`}>
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover" />
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-slate-200">{user.name}</h4>
              <p className="text-sm text-slate-500">
                {new Date(story.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
         )
      })}
    </div>
  );

  const renderCalls = () => (
    <div className="flex-1 overflow-y-auto p-4">
       <div className="mb-4">
         <button className="w-full bg-neon-accent/10 text-neon-accent hover:bg-neon-accent/20 font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            New Call
         </button>
       </div>
       
       {calls.map(call => {
         const user = MOCK_USERS.find(u => u.id === call.userId);
         if (!user) return null;
         
         return (
           <div key={call.id} className="flex items-center justify-between mb-4 p-2 hover:bg-slate-800/30 rounded-lg">
              <div className="flex items-center">
                 <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                 <div className="ml-3">
                   <h4 className={`font-semibold ${call.direction === 'missed' ? 'text-red-400' : 'text-slate-200'}`}>
                     {user.name}
                   </h4>
                   <div className="flex items-center gap-1 text-sm text-slate-500">
                      {call.direction === 'incoming' && <PhoneIncoming size={14} className="text-neon-accent" />}
                      {call.direction === 'outgoing' && <PhoneOutgoing size={14} className="text-neon-primary" />}
                      {call.direction === 'missed' && <PhoneMissed size={14} className="text-red-500" />}
                      <span>{new Date(call.timestamp).toLocaleString()}</span>
                   </div>
                 </div>
              </div>
              <button 
                onClick={() => onStartCall(user.id, call.type)} 
                className="p-2 text-neon-accent hover:bg-neon-accent/10 rounded-full"
              >
                {call.type === 'video' ? <Video size={20} /> : <Phone size={20} />}
              </button>
           </div>
         );
       })}
    </div>
  );

  const renderSettings = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4">
         <img src={ME_USER.avatar} alt="Me" className="w-16 h-16 rounded-full border-2 border-neon-primary object-cover" />
         <div>
           <h3 className="text-xl font-bold text-white">{ME_USER.name}</h3>
           <p className="text-slate-400 text-sm">{ME_USER.bio}</p>
         </div>
      </div>

      <div className="space-y-2">
        <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-700 transition">
          <div className="flex items-center gap-3 text-slate-200">
             <div className="p-2 bg-slate-700 rounded-lg"><UserIcon size={20} /></div>
             <span>Account</span>
          </div>
        </div>
         <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-700 transition">
          <div className="flex items-center gap-3 text-slate-200">
             <div className="p-2 bg-slate-700 rounded-lg"><MessageSquare size={20} /></div>
             <span>Chats</span>
          </div>
        </div>
         <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-700 transition">
          <div className="flex items-center gap-3 text-red-400">
             <div className="p-2 bg-red-400/10 rounded-lg"><LogOut size={20} /></div>
             <span>Log out</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full md:w-96 bg-slate-900 border-r border-slate-700 flex flex-col h-full flex-shrink-0">
      {renderHeader()}
      {currentView === 'chats' && renderChats()}
      {currentView === 'status' && renderStatus()}
      {currentView === 'calls' && renderCalls()}
      {currentView === 'settings' && renderSettings()}
    </div>
  );
};

export default Sidebar;