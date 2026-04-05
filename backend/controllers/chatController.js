import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  const user = req.user;
  if (!user.coupleId) {
    return res.status(403).json({ message: 'Not paired with a partner.' });
  }
  
  const messages = await Message.find({ coupleId: user.coupleId })
    .sort({ createdAt: 1 })
    .limit(100);

  res.json(messages);
};

export const sendMessage = async (req, res) => {
  const { content, mood } = req.body;
  const user = req.user;

  if (!user.coupleId || !user.partnerId) {
    return res.status(403).json({ message: 'Not paired with a partner.' });
  }

  const message = await Message.create({
    senderId: user._id,
    receiverId: user.partnerId,
    coupleId: user.coupleId,
    content,
    mood: mood || 'normal'
  });

  res.status(201).json(message);
};

export const sendImageMessage = async (req, res) => {
  const user = req.user;

  if (!user.coupleId || !user.partnerId) {
    return res.status(403).json({ message: 'Not paired with a partner.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const url = req.file.path;

  const message = await Message.create({
    senderId: user._id,
    receiverId: user.partnerId,
    coupleId: user.coupleId,
    imageUrl: url,
    mood: 'normal'
  });

  res.status(201).json(message);
};
