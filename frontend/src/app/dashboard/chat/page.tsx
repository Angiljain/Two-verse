'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Send, Image as ImageIcon, Heart, Smile, ChevronLeft } from 'lucide-react';
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
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/chat');
        setMessages(res.data);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
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
           // Fire browser notification if app is in background
           const body = msg.imageUrl ? '📷 Sent you a photo' : (msg.content || '');
           notify('💌 New message from your partner', body);
        }
        setTimeout(scrollToBottom, 50);
      });

      socket.on('typing', (data: { senderId: string, typing: boolean }) => {
        if (data.senderId !== user._id) {
          setPartnerTyping(data.typing);
          if (data.typing) setTimeout(scrollToBottom, 50);
        }
      });

      socket.on('messages_seen', (data) => {
        if (data.receiverId !== user._id) {
           setMessages(prev => prev.map(m => (!m.seen ? { ...m, seen: true } : m)));
        }
      });

      // Mark unread messages on initial load
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
    <div className="flex-1 flex flex-col glass-panel md:rounded-3xl overflow-hidden relative border-0 md:border">
      <div className="p-4 border-b border-white/10 flex items-center bg-black/40 backdrop-blur-md z-10 sticky top-0">
        <button 
          onClick={() => router.push('/dashboard')}
          className="mr-3 p-2 -ml-2 rounded-full md:hidden text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center font-bold">
          {partnerName?.charAt(0) || 'P'}
        </div>
        <div className="ml-3">
          <h3 className="font-bold">{partnerName || 'Your Partner'}</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/40">
            <Heart className="w-12 h-12 text-primary/30 mb-2" />
            <p>Start your private conversation...</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isMine = msg.senderId === user?._id;
              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMine ? 'bg-primary text-white rounded-br-none' : 'glass-panel text-white/90 rounded-bl-none'}`}>
                    {msg.imageUrl && (
                       <img src={msg.imageUrl} onLoad={scrollToBottom} alt="attachment" className="rounded-xl mb-2 max-w-full max-h-48 object-cover" />
                    )}
                    {msg.content}
                    <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                      <span className="text-[10px] block text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && (
                        <span className="text-[10px] tracking-tighter w-3 ml-1 text-white">
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
             <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                <div className="glass-panel text-white/70 rounded-2xl rounded-bl-none px-4 py-2 text-xs italic flex gap-1 items-center">
                   typing<span className="animate-bounce inline-block delay-75">.</span><span className="animate-bounce inline-block delay-100">.</span><span className="animate-bounce inline-block delay-150">.</span>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {showEmoji && (
        <div className="absolute bottom-20 right-4 z-50">
          <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} />
        </div>
      )}

      <form onSubmit={sendMessage} className="p-2 sm:p-4 border-t border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-1 sm:gap-2">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
        />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-white/50 hover:text-white transition-colors shrink-0">
          <ImageIcon className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-2 text-white/50 hover:text-white transition-colors shrink-0">
          <Smile className="w-5 h-5" />
        </button>
        <input 
          value={inputVal}
          onChange={handleTyping}
          placeholder="Message..."
          className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-full px-3 py-2 sm:px-4 sm:py-3 outline-none focus:border-primary/50 transition-colors"
        />
        <Button type="submit" className="!rounded-full px-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </form>
    </div>
  );
}
