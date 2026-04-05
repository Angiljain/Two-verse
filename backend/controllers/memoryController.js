import Memory from '../models/Memory.js';

export const getMemories = async (req, res) => {
  const user = req.user;
  if (!user.coupleId) return res.status(403).json({ message: 'Not paired' });

  const memories = await Memory.find({ coupleId: user.coupleId }).sort({ createdAt: -1 });
  res.json(memories);
};

export const uploadMemory = async (req, res) => {
  const user = req.user;
  if (!user.coupleId) return res.status(403).json({ message: 'Not paired' });

  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  let url = req.file.path;
  if (!url.startsWith('http')) {
    const port = process.env.PORT || 5000;
    url = `http://localhost:${port}/${url.replace(/\\/g, '/')}`;
  }

  const memory = await Memory.create({
    url,
    caption: req.body.caption || '',
    coupleId: user.coupleId,
    uploadedBy: user._id
  });

  res.status(201).json(memory);
};

export const deleteMemory = async (req, res) => {
  try {
    const user = req.user;
    if (!user.coupleId) return res.status(403).json({ message: 'Not paired' });

    const memory = await Memory.findById(req.params.id);
    
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    // Compare both as strings to handle ObjectId vs string mismatches
    const memoryCoupleId = memory.coupleId?.toString();
    const userCoupleId = user.coupleId?.toString();

    console.log('Delete attempt - memory coupleId:', memoryCoupleId, '| user coupleId:', userCoupleId);

    if (memoryCoupleId !== userCoupleId) {
      return res.status(401).json({ message: 'Not authorized to delete this memory' });
    }

    // Attempt to delete local file if it exists
    if (memory.url && memory.url.includes('localhost')) {
      try {
        const filename = memory.url.split('/uploads/').pop();
        const { existsSync, unlinkSync } = await import('fs');
        const { join } = await import('path');
        const filepath = join(process.cwd(), 'uploads', filename);
        if (existsSync(filepath)) unlinkSync(filepath);
      } catch (e) {
        console.error('File cleanup failed', e);
      }
    }

    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Memory removed' });
  } catch (err) {
    console.error('Delete memory error:', err);
    res.status(500).json({ message: 'Server error while deleting memory', error: err.message });
  }
};
