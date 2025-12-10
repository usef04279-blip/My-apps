import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Story } from '../types';
import { MOCK_USERS } from '../constants';

interface StatusViewerProps {
  story: Story;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const StatusViewer: React.FC<StatusViewerProps> = ({ story, onClose, onNext, onPrev }) => {
  const [progress, setProgress] = useState(0);
  const user = MOCK_USERS.find(u => u.id === story.userId);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onNext(); // Auto advance
          return 100;
        }
        return prev + 1; // 100 ticks ~ 3-5 seconds depending on interval
      });
    }, 50); // 50ms * 100 = 5000ms = 5s

    return () => clearInterval(interval);
  }, [story, onNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center">
        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-700 rounded-full overflow-hidden z-20">
            <div 
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-20 text-white">
             <div className="flex items-center gap-3">
                 <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full border border-white" />
                 <div>
                     <h4 className="font-semibold text-sm shadow-black drop-shadow-md">{user?.name}</h4>
                     <span className="text-xs text-gray-300 shadow-black drop-shadow-md">
                        {new Date(story.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                     </span>
                 </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
                 <X size={24} />
             </button>
        </div>

        {/* Content */}
        <div className="relative w-full h-full max-w-md bg-gray-900 flex items-center justify-center">
             <img src={story.mediaUrl} alt="Story" className="w-full h-full object-cover md:rounded-lg" />
        </div>

        {/* Controls (Invisible mostly, visible on hover) */}
        <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition">
            <ChevronLeft size={32} />
        </button>
         <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition">
            <ChevronRight size={32} />
        </button>
    </div>
  );
};

export default StatusViewer;