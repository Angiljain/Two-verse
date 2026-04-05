import mongoose from 'mongoose';

const coupleSchema = mongoose.Schema({
  partner1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partner2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Couple = mongoose.model('Couple', coupleSchema);
export default Couple;
