import React, { useEffect, useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2 } from 'lucide-react';
import { User } from '../types';

interface CallInterfaceProps {
  user: User;
  type: 'audio' | 'video';
  onEndCall: () => void;
}

const CallInterface: React.FC<CallInterfaceProps> = ({ user, type, onEndCall }) => {
  const [callStatus, setCallStatus] = useState<'Calling...' | 'Ringing...' | 'Connected'>('Calling...');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    // Simulate connection flow
    const ringTimer = setTimeout(() => setCallStatus('Ringing...'), 1500);
    const connectTimer = setTimeout(() => setCallStatus('Connected'), 3500);

    return () => {
      clearTimeout(ringTimer);
      clearTimeout(connectTimer);
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callStatus === 'Connected') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
       {/* Background abstract shapes */}
       <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-primary/20 rounded-full blur-[100px]"></div>
       <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-secondary/20 rounded-full blur-[100px]"></div>

       <div className="flex flex-col items-center z-10 animate-fade-in">
          <div className="relative mb-8">
            <img 
                src={user.avatar} 
                alt={user.name} 
                className={`w-32 h-32 rounded-full border-4 border-slate-700 object-cover shadow-2xl ${callStatus === 'Ringing...' ? 'animate-pulse' : ''}`}
            />
             {callStatus === 'Connected' && (
                 <div className="absolute -bottom-2 -right-2 bg-neon-accent p-2 rounded-full border-4 border-slate-900">
                    {type === 'video' ? <Video size={16} className="text-white" /> : <Phone size={16} className="text-white" />}
                 </div>
             )}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
          <p className="text-neon-primary font-medium mb-12">
             {callStatus === 'Connected' ? formatDuration(duration) : callStatus}
          </p>

          <div className="flex items-center gap-6">
             <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`p-4 rounded-full transition ${isMuted ? 'bg-white text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
             >
                {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
             </button>
             
             {type === 'video' && (
                 <button 
                    onClick={() => setIsVideoOff(!isVideoOff)} 
                    className={`p-4 rounded-full transition ${isVideoOff ? 'bg-white text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                 >
                    {isVideoOff ? <VideoOff size={28} /> : <Video size={28} />}
                 </button>
             )}

             <button 
                onClick={onEndCall} 
                className="p-5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/50 transform hover:scale-110 transition"
             >
                <PhoneOff size={32} />
             </button>

             <button className="p-4 rounded-full bg-slate-800 text-white hover:bg-slate-700">
                <Volume2 size={28} />
             </button>
          </div>
       </div>
    </div>
  );
};

export default CallInterface;