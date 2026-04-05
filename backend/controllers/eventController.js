import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
  const user = req.user;
  if (!user.coupleId) return res.status(403).json({ message: 'Not paired' });

  const events = await Event.find({ coupleId: user.coupleId }).sort({ date: 1 });
  res.json(events);
};

export const createEvent = async (req, res) => {
  const { title, date, type } = req.body;
  const user = req.user;

  if (!user.coupleId) return res.status(403).json({ message: 'Not paired' });

  const event = await Event.create({
    title,
    date: new Date(date),
    type,
    coupleId: user.coupleId
  });

  res.status(201).json(event);
};

export const deleteEvent = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (!user.coupleId) return res.status(403).json({ message: 'Not paired' });

  const event = await Event.findById(id);

  if (!event || event.coupleId.toString() !== user.coupleId.toString()) {
    return res.status(404).json({ message: 'Event not found' });
  }

  await event.deleteOne();
  res.json({ message: 'Event removed' });
};
