'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Lock, Heart, Plus, Calendar as CalendarIcon } from 'lucide-react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  deliveryDate?: string;
  createdAt: string;
  author: { name: string };
}

export default function VaultPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'Love', deliveryDate: '' });

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/notes', newNote);
      setShowModal(false);
      setNewNote({ title: '', content: '', category: 'Love', deliveryDate: '' });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Love': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Apology': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Memory': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
    }
  };

  return (
    <div className="space-y-8 pb-10 pt-4 px-2">
      <div className="flex justify-between items-center bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-20 py-2 border-b border-white/[0.02]">
        <div>
          <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold mb-1">Inner Thoughts</p>
          <h1 className="text-3xl font-light tracking-tight text-zinc-100 flex items-center gap-2">
            The Vault
          </h1>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:bg-primary/20 hover:text-primary transition-colors hover:border-primary/30"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div 
              key={note._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#18181b] border border-white/[0.05] p-6 rounded-[24px] break-inside-avoid relative overflow-hidden group inline-block w-full shadow-lg"
            >
              <div className="flex justify-between items-start mb-5">
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${getCategoryColor(note.category)}`}>
                  {note.category}
                </span>
                {note.deliveryDate && new Date(note.deliveryDate) > new Date() && (
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" /> {new Date(note.deliveryDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-zinc-100 mb-3">{note.title}</h3>
              <p className="text-zinc-400 whitespace-pre-wrap text-sm leading-relaxed mb-6 font-medium">{note.content}</p>
              <div className="flex justify-between items-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest pt-4 border-t border-white/[0.05]">
                <span>{note.author?.name || 'Unknown'}</span>
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notes.length === 0 && (
          <div className="col-span-full h-[300px] flex flex-col items-center justify-center text-zinc-500 glass-panel rounded-[32px] border border-white/[0.02]">
            <Lock className="w-8 h-8 opacity-40 mb-3" />
            <p className="font-medium tracking-wide">The vault is quiet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#09090b]/90 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="bg-[#18181b] w-full max-w-lg rounded-[32px] p-8 border border-white/[0.05] shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light tracking-tight text-zinc-100">Draft a Note</h2>
            </div>
            <form onSubmit={handleCreateNote} className="space-y-5">
              <Input 
                label="Title" 
                placeholder="A midnight thought..." 
                value={newNote.title}
                onChange={e => setNewNote({...newNote, title: e.target.value})}
                required
              />
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Category</label>
                <select 
                  className="w-full bg-[#09090b] border border-white/[0.05] rounded-2xl px-4 py-3.5 text-zinc-300 outline-none focus:border-primary/50 transition-colors cursor-pointer appearance-none"
                  value={newNote.category}
                  onChange={e => setNewNote({...newNote, category: e.target.value})}
                >
                  <option value="Love">Love</option>
                  <option value="Apology">Apology</option>
                  <option value="Memory">Memory</option>
                  <option value="Random">Random</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Message</label>
                <textarea 
                  rows={5}
                  className="w-full bg-[#09090b] border border-white/[0.05] rounded-2xl px-4 py-3.5 text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="Express your feelings intimately..."
                  value={newNote.content}
                  onChange={e => setNewNote({...newNote, content: e.target.value})}
                  required
                />
              </div>

              <Input 
                label="Deliver on (Optional surprises)" 
                type="datetime-local" 
                value={newNote.deliveryDate}
                onChange={e => setNewNote({...newNote, deliveryDate: e.target.value})}
              />

              <div className="flex items-center gap-3 pt-6 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 rounded-full font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors">
                  Discard
                </button>
                <button type="submit" className="flex-1 py-3.5 rounded-full font-semibold bg-zinc-200 text-[#09090b] hover:bg-white transition-colors">
                  Seal Vault
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
