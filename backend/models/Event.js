import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  coupleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple', required: true },
  type: { type: String, enum: ['Anniversary', 'Date', 'Plan'], default: 'Date' }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
