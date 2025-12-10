import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, MoreVertical, Phone, Video, Smile, Image as ImageIcon, X, File } from 'lucide-react';
import { Chat, Message, User } from '../types';
import { ME_USER } from '../constants';

interface ChatWindowProps {
  chat: Chat | null;
  currentUser: User;
  onSendMessage: (chatId: string, text: string, type: 'text' | 'image' | 'audio' | 'file') => void;
  onStartCall: (userId: string, type: 'audio' | 'video') => void;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUser, onSendMessage, onStartCall, onBack }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-slate-950 text-slate-500">
        <div className="p-8 bg-slate-900 rounded-full mb-4 animate-pulse-slow">
            <MessageSquarePlusIcon size={64} className="text-neon-primary opacity-50" />
        </div>
        <h2 className="text-2xl font-light">Welcome to <span className="text-neon-primary font-bold">meChat</span></h2>
        <p className="mt-2">Select a chat to start messaging</p>
      </div>
    );
  }

  const otherParticipant = chat.participants.find(p => p.id !== currentUser.id) || chat.participants[0];
  const name = chat.isGroup ? chat.groupName : otherParticipant.name;
  const avatar = chat.isGroup ? chat.groupAvatar : otherParticipant.avatar;

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(chat.id, inputText, 'text');
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulation of file upload
      const file = e.target.files[0];
      const type = file.type.startsWith('image') ? 'image' : 'file';
      // In a real app, upload here. We just pretend.
      onSendMessage(chat.id, `Sent a file: ${file.name}`, type);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const startRecording = () => {
      setIsRecording(true);
  };
  
  const stopRecording = () => {
      setIsRecording(false);
      onSendMessage(chat.id, "🎤 Voice Note (0:05)", 'audio');
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 relative w-full">
      {/* Header */}
      <div className="h-16 px-4 bg-slate-900 border-b border-slate-700 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="md:hidden text-slate-400 hover:text-white mr-2">
                <X size={24} />
            </button>
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover border border-slate-600" />
          <div className="flex flex-col">
            <h3 className="font-semibold text-slate-100 leading-tight">{name}</h3>
            <span className="text-xs text-neon-accent">
                {chat.isGroup ? 'Group' : otherParticipant.status === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
           {!chat.isGroup && (
               <>
                <button onClick={() => onStartCall(otherParticipant.id, 'audio')} className="hover:text-neon-accent hover:bg-slate-800 p-2 rounded-full transition">
                    <Phone size={20} />
                </button>
                <button onClick={() => onStartCall(otherParticipant.id, 'video')} className="hover:text-neon-secondary hover:bg-slate-800 p-2 rounded-full transition">
                    <Video size={20} />
                </button>
               </>
           )}
          <button className="hover:text-white hover:bg-slate-800 p-2 rounded-full transition">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      >
        {chat.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-3 relative shadow-md ${
                  isMe 
                    ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-100 rounded-bl-none'
                }`}
              >
                {!isMe && chat.isGroup && (
                   <p className="text-xs text-neon-secondary font-bold mb-1">
                       {chat.participants.find(p => p.id === msg.senderId)?.name}
                   </p>
                )}
                
                {msg.type === 'text' && <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                
                {msg.type === 'image' && (
                    <div className="mb-1">
                        {msg.mediaUrl ? (
                            <img src={msg.mediaUrl} alt="Attachment" className="rounded-lg max-h-60 object-cover w-full" />
                        ) : (
                            <div className="flex items-center gap-2 bg-black/20 p-3 rounded-lg">
                                <ImageIcon size={20} /> <span>{msg.text}</span>
                            </div>
                        )}
                    </div>
                )}

                 {msg.type === 'file' && (
                    <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg mb-1">
                        <div className="bg-slate-700 p-2 rounded"><File size={24} /></div>
                        <span className="text-sm underline break-all">{msg.text}</span>
                    </div>
                )}
                
                {msg.type === 'audio' && (
                    <div className="flex items-center gap-2 min-w-[150px]">
                        <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5"></div>
                        </button>
                        <div className="h-1 flex-1 bg-black/20 rounded-full overflow-hidden">
                             <div className="h-full w-1/3 bg-white/50"></div>
                        </div>
                        <span className="text-xs font-mono opacity-80">0:05</span>
                    </div>
                )}

                <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <span className="font-bold">✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-900 border-t border-slate-700 flex items-end gap-2">
        <button 
            className="p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition"
            onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={22} />
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
            accept="image/*,video/*,.pdf,.doc,.docx"
        />
        
        <div className="flex-1 bg-slate-800 rounded-2xl flex items-center px-4 py-2 border border-slate-700 focus-within:border-neon-primary transition">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-transparent text-slate-200 focus:outline-none placeholder-slate-500 py-1 max-h-32"
          />
           <button className="text-slate-400 hover:text-neon-secondary ml-2">
             <Smile size={20} />
          </button>
        </div>

        {inputText.trim() ? (
          <button
            onClick={handleSend}
            className="p-3 bg-neon-primary text-white rounded-full hover:bg-sky-600 transition shadow-lg shadow-sky-500/30 transform active:scale-95"
          >
            <Send size={20} />
          </button>
        ) : (
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={() => isRecording && stopRecording()}
            className={`p-3 rounded-full transition shadow-lg transform active:scale-95 ${
                isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-red-500/30' 
                : 'bg-slate-800 text-neon-accent hover:bg-slate-700'
            }`}
          >
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

// Helper Icon for Empty State
const MessageSquarePlusIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export default ChatWindow;