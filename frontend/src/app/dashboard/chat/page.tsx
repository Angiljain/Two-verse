'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Send, Image as ImageIcon, Heart } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  _id: string;
  senderId: string;
  content: string;
  mood: string;
  createdAt: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !user) return;

    try {
      const localId = Date.now().toString(); // optimistic 
      const res = await api.post('/chat', { content: inputVal, mood: 'normal' });
      socketRef.current?.emit('send_message', res.data);
      setInputVal('');
      // Message is appended via receive_message since server broadcasts back to the room
    } catch (err) {
      console.error(err);
    }
  };

  const partnerName = typeof user?.partner === 'object' ? (user.partner as any).name : user?.partner;

  return (
    <div className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden relative">
      <div className="p-4 border-b border-white/10 flex items-center bg-black/40 backdrop-blur-md z-10">
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
                    {msg.content}
                    <span className="text-[10px] opacity-60 block text-right mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-2">
        <button type="button" className="p-2 text-white/50 hover:text-white transition-colors">
          <ImageIcon className="w-5 h-5" />
        </button>
        <input 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 outline-none focus:border-primary/50 transition-colors"
        />
        <Button type="submit" className="!rounded-full px-0 w-12 h-12 flex items-center justify-center">
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
