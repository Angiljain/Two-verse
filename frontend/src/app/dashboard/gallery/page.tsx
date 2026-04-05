'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Image as ImageIcon, Plus, Heart, Upload } from 'lucide-react';
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
      await api.post('/memories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption('');
      fetchMemories();
    } catch (err) {
      console.error(err);
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
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(mem)}
              >
                <img src={mem.url} alt={mem.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
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
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
           <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-4xl max-h-[90vh] flex flex-col outline-none overflow-hidden cursor-default"
            onClick={e => e.stopPropagation()}
           >
             <img src={selectedImage.url} alt={selectedImage.caption} className="w-full max-h-[80vh] object-contain rounded-xl" />
             <div className="absolute top-4 right-4 flex gap-4 bg-black/60 backdrop-blur-md rounded-full p-2">
                 <button 
                    onClick={async (e) => {
                       e.stopPropagation();
                       if (confirm('Are you sure you want to delete this memory?')) {
                          try {
                             await api.delete(`/memories/${selectedImage._id}`);
                             setMemories(prev => prev.filter(m => m._id !== selectedImage._id));
                             setSelectedImage(null);
                          } catch (err) { console.error('Failed to delete memory', err); }
                       }
                    }}
                    className="p-2 text-white hover:text-red-500 transition-colors bg-white/10 rounded-full"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                 </button>
             </div>
             {selectedImage.caption && (
               <div className="p-4 text-center mt-4 glass-panel rounded-xl">
                 <p className="text-lg">{selectedImage.caption}</p>
                 <span className="text-xs text-white/50 mt-1">{new Date(selectedImage.createdAt).toLocaleDateString()}</span>
               </div>
             )}
           </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
