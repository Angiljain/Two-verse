import mongoose from 'mongoose';

const noteSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coupleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Love', 'Apology', 'Memory', 'Random'], default: 'Love' },
  deliveryDate: { type: Date } 
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;
