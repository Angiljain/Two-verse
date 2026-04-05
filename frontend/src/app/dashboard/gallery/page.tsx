'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Image as ImageIcon, Plus, Heart, Upload, Trash2, X } from 'lucide-react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Memory {
  _id: string;
  url: string;
  caption: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Memory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMemories = async () => {
    try {
      const res = await api.get('/memories');
      setMemories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('caption', caption);

    try {
      await api.post('/memories', formData);
      setShowUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption('');
      fetchMemories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this memory permanently?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/memories/${id}`);
      setMemories(prev => prev.filter(m => m._id !== id));
      if (selectedImage?._id === id) setSelectedImage(null);
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Could not delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><ImageIcon className="w-8 h-8 text-primary" /> Memory Gallery</h1>
          <p className="text-white/60 mt-1">A timeline of your captured moments.</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-6">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Upload Memory</span>
        </Button>
      </div>

      {memories.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-white/40 glass-panel rounded-3xl w-full">
          <Heart className="w-12 h-12 text-primary/30 mb-2" />
          <p>No memories uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {memories.map((mem) => (
              <motion.div 
                key={mem._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={mem.url}
                  alt={mem.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onClick={() => setSelectedImage(mem)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(mem._id); }}
                    disabled={deletingId === mem._id}
                    className="self-end bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                  >
                    {deletingId === mem._id
                      ? <span className="w-4 h-4 block border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                  <p className="text-sm font-medium line-clamp-2">{mem.caption}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-md rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Upload Memory</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                
                <div 
                  className="border-2 border-dashed border-white/20 rounded-2xl h-48 flex items-center justify-center overflow-hidden relative cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white/50">
                      <Upload className="w-8 h-8 mb-2" />
                      <p className="text-sm">Tap to select photo</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                </div>

                <Input 
                  label="Caption (Optional)" 
                  placeholder="A beautiful day..." 
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                />

                <div className="flex items-center gap-4 pt-4 mt-4 border-t border-white/10">
                  <Button type="button" variant="ghost" onClick={() => {
                    setShowUpload(false);
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={!selectedFile}>
                    Upload
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
           <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col outline-none cursor-default"
            onClick={e => e.stopPropagation()}
           >
             {/* Top action bar */}
             <div className="absolute top-3 right-3 z-10 flex gap-2">
               <button
                 onClick={() => handleDelete(selectedImage._id)}
                 disabled={deletingId === selectedImage._id}
                 className="bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2.5 transition-colors shadow-lg"
               >
                 {deletingId === selectedImage._id
                   ? <span className="w-5 h-5 block border-2 border-white/50 border-t-white rounded-full animate-spin" />
                   : <Trash2 className="w-5 h-5" />}
               </button>
               <button
                 onClick={() => setSelectedImage(null)}
                 className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors shadow-lg"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>

             <img src={selectedImage.url} alt={selectedImage.caption} className="w-full max-h-[80vh] object-contain rounded-xl" />
             {selectedImage.caption && (
               <div className="p-4 text-center mt-3 glass-panel rounded-xl">
                 <p className="text-lg">{selectedImage.caption}</p>
                 <span className="text-xs text-white/50 mt-1 block">{new Date(selectedImage.createdAt).toLocaleDateString()}</span>
               </div>
             )}
           </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
