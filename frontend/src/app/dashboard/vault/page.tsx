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
      case 'Love': return 'bg-pink-500/20 text-pink-300';
      case 'Apology': return 'bg-blue-500/20 text-blue-300';
      case 'Memory': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-purple-500/20 text-purple-300';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Lock className="w-8 h-8 text-primary" /> Love Notes Vault</h1>
          <p className="text-white/60 mt-1">A secure place for deep feelings and long-form memories.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Write a Note</span>
        </Button>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div 
              key={note._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 rounded-3xl break-inside-avoid relative overflow-hidden group inline-block w-full"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(note.category)}`}>
                  {note.category}
                </span>
                {note.deliveryDate && new Date(note.deliveryDate) > new Date() && (
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" /> Locks until {new Date(note.deliveryDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{note.title}</h3>
              <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed mb-4">{note.content}</p>
              <div className="flex justify-between items-center text-xs text-white/40 border-t border-white/5 pt-4 mt-4">
                <span>By {note.author?.name || 'Unknown'}</span>
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notes.length === 0 && (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-white/40 glass-panel rounded-3xl">
            <Heart className="w-12 h-12 text-primary/30 mb-2" />
            <p>Your vault is empty. Write your first note.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="glass-panel w-full max-w-xl rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Write a Note</h2>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <Input 
                label="Title" 
                placeholder="A letter to my love..." 
                value={newNote.title}
                onChange={e => setNewNote({...newNote, title: e.target.value})}
                required
              />
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/80">Category</label>
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
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
                <label className="text-sm font-medium text-white/80">Message</label>
                <textarea 
                  rows={6}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-primary transition-colors"
                  placeholder="Express your feelings..."
                  value={newNote.content}
                  onChange={e => setNewNote({...newNote, content: e.target.value})}
                  required
                />
              </div>

              <Input 
                label="Deliver on (Optional for surprises)" 
                type="datetime-local" 
                value={newNote.deliveryDate}
                onChange={e => setNewNote({...newNote, deliveryDate: e.target.value})}
              />

              <div className="flex items-center gap-4 pt-4 mt-4 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Save to Vault
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
