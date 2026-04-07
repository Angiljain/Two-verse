'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Send, Image as ImageIcon, Heart, Smile, ChevronLeft, ChevronDown } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import { useNotifications } from '../../../hooks/useNotifications';

interface Message {
  _id: string;
  senderId: string;
  content?: string;
  imageUrl?: string;
  mood: string;
  seen?: boolean;
  createdAt: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { notify } = useNotifications();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollBottom(!isNearBottom);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/chat');
        setMessages(res.data);
        setTimeout(() => scrollToBottom('auto'), 100);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.coupleId) fetchMessages();
  }, [user]);

  useEffect(() => {
    if (user?.coupleId) {
      const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');
      socketRef.current = socket;

      socket.emit('join_couple_room', user.coupleId);

      socket.on('receive_message', (msg: Message) => {
        setMessages(prev => {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        if (msg.senderId !== user._id) {
           socket.emit('mark_seen', { coupleId: user.coupleId, receiverId: user._id });
           const body = msg.imageUrl ? '📷 Sent you a photo' : (msg.content || '');
           notify('💌 New message from your partner', body);
        }
        setTimeout(() => scrollToBottom(), 100);
      });

      socket.on('typing', (data: { senderId: string, typing: boolean }) => {
        if (data.senderId !== user._id) {
          setPartnerTyping(data.typing);
          if (data.typing) setTimeout(() => scrollToBottom(), 100);
        }
      });

      socket.on('messages_seen', (data) => {
        if (data.receiverId !== user._id) {
           setMessages(prev => prev.map(m => (!m.seen ? { ...m, seen: true } : m)));
        }
      });

      socket.emit('mark_seen', { coupleId: user.coupleId, receiverId: user._id });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    if (!socketRef.current || !user) return;

    socketRef.current.emit('typing', { coupleId: user.coupleId, senderId: user._id, typing: true });
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typing', { coupleId: user.coupleId, senderId: user._id, typing: false });
    }, 1500);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !user) return;

    try {
      const res = await api.post('/chat', { content: inputVal, mood: 'normal' });
      socketRef.current?.emit('send_message', res.data);
      setInputVal('');
      setShowEmoji(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/chat/image', formData);
      socketRef.current?.emit('send_message', res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputVal(prev => prev + emojiData.emoji);
  };

  const partnerName = typeof user?.partner === 'object' ? (user.partner as any).name : user?.partner;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Header - Transparent & Refined */}
      <div className="shrink-0 p-4 pt-[max(1rem,env(safe-area-inset-top))] flex items-center justify-between z-50 sticky top-0 bg-[#09090b]/90 backdrop-blur-2xl border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={(e) => { e.preventDefault(); router.push('/dashboard'); }}
            className="p-3 -ml-2 rounded-full md:hidden text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.button>
          <div className="relative group">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white border border-white/10 shadow-[0_0_15px_rgba(255,100,100,0.2)] transition-transform group-hover:scale-105">
               {partnerName?.charAt(0) || 'P'}
             </div>
             <div className="absolute right-0 bottom-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#09090b]" />
          </div>
          <div>
            <h3 className="font-bold tracking-tight text-zinc-100 text-lg leading-tight">{partnerName || 'Your Partner'}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0 p-4 space-y-6 overscroll-y-contain scroll-smooth scrollbar-hide"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/20 select-none">
            <Heart className="w-16 h-16 text-primary/20 mb-4 animate-pulse" strokeWidth={1} />
            <p className="font-medium tracking-wide">Beginning of your story...</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isMine = msg.senderId === user?._id;
              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-end gap-2 mb-2`}
                >
                  <div className={`relative max-w-[85%] sm:max-w-[70%] px-5 py-3.5 text-[15px] leading-relaxed transition-all shadow-xl
                    ${isMine 
                      ? 'bg-gradient-to-tr from-primary to-accent text-white rounded-[28px] rounded-br-sm shadow-primary/10' 
                      : 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08] text-zinc-200 rounded-[28px] rounded-bl-sm shadow-black/20'}`}
                  >
                    {msg.imageUrl && (
                       <div className="relative overflow-hidden rounded-2xl mb-2.5 -mx-2 -mt-1 group cursor-zoom-in">
                          <img src={msg.imageUrl} onLoad={() => scrollToBottom()} alt="attachment" className="w-full max-h-[350px] object-cover transition-transform group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                    )}
                    <span className="break-words font-medium">{msg.content}</span>
                    <div className={`flex items-center justify-end gap-1.5 mt-2 font-medium ${isMine ? 'opacity-70' : 'opacity-30'}`}>
                      <span className="text-[10px] tracking-widest uppercase font-bold">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && (
                        <span className="text-[11px] tracking-tight ml-0.5 font-bold">
                          {msg.seen ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        
        <AnimatePresence>
          {partnerTyping && (
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                <div className="bg-white/[0.02] backdrop-blur-lg border border-white/[0.05] text-zinc-400 rounded-3xl rounded-bl-none px-5 py-3 text-xs italic flex gap-1.5 items-center shadow-lg">
                   <span>thinking</span>
                   <div className="flex gap-1">
                     <span className="animate-bounce delay-75">.</span>
                     <span className="animate-bounce delay-200">.</span>
                     <span className="animate-bounce delay-300">.</span>
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Floating Scroll to Bottom */}
      <AnimatePresence>
        {showScrollBottom && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-24 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-2xl z-40 hover:bg-white/20 transition-all"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area */}
      {showEmoji && (
        <div className="absolute bottom-24 right-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} lazyLoadEmojis={true} />
        </div>
      )}

      <div className="p-4 bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent shrink-0">
        <div className="mx-auto max-w-4xl bg-white/[0.03] backdrop-blur-2xl p-2 rounded-[32px] flex items-center gap-2 shadow-2xl border border-white/[0.07] ring-1 ring-white/[0.03]">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
          />
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="w-11 h-11 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all shrink-0"
          >
            <ImageIcon className="w-5.5 h-5.5" />
          </motion.button>
          
          <input 
            value={inputVal}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
            placeholder="Type your message..."
            className="flex-1 min-w-0 bg-transparent px-4 py-2 text-[15px] md:text-16 outline-none text-zinc-100 placeholder:text-zinc-600 font-medium scrollbar-hide"
          />
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="button" 
            onClick={() => setShowEmoji(!showEmoji)} 
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all shrink-0 ${showEmoji ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/10'}`}
          >
            <Smile className="w-5.5 h-5.5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: inputVal.trim() ? 1.05 : 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={!inputVal.trim()}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shrink-0 shadow-lg ${inputVal.trim() ? 'bg-primary text-white shadow-primary/20' : 'bg-white/5 text-zinc-600'}`}
          >
             <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

