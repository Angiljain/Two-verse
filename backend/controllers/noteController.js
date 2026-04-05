import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  const user = req.user;
  if (!user.coupleId) return res.status(403).json({ message: 'Not paired' });

  const now = new Date();
  const notes = await Note.find({ 
    coupleId: user.coupleId,
    $or: [{ deliveryDate: { $lte: now } }, { deliveryDate: { $exists: false } }, { deliveryDate: null }]
  }).sort({ createdAt: -1 }).populate('author', 'name');

  res.json(notes);
};

export const createNote = async (req, res) => {
  const { title, content, category, deliveryDate } = req.body;
  const user = req.user;

  if (!user.coupleId) return res.status(403).json({ message: 'Not paired' });

  const note = await Note.create({
    author: user._id,
    coupleId: user.coupleId,
    title,
    content,
    category: category || 'Love',
    deliveryDate: deliveryDate ? new Date(deliveryDate) : null
  });

  res.status(201).json(note);
};
