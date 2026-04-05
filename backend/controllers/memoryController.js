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

  // Cloudinary URL is returned in req.file.path
  const url = req.file.path;

  const memory = await Memory.create({
    url,
    caption: req.body.caption || '',
    coupleId: user.coupleId,
    uploadedBy: user._id
  });

  res.status(201).json(memory);
};

export const deleteMemory = async (req, res) => {
  const user = req.user;
  if (!user.coupleId) return res.status(403).json({ message: 'Not paired' });

  const memory = await Memory.findById(req.params.id);
  
  if (!memory) {
    return res.status(404).json({ message: 'Memory not found' });
  }

  // To ensure the user can only delete memories belonging to their couple
  if (memory.coupleId.toString() !== user.coupleId.toString()) {
    return res.status(401).json({ message: 'Not authorized to delete this memory' });
  }

  await Memory.findByIdAndDelete(req.params.id);
  res.json({ message: 'Memory removed' });
};
