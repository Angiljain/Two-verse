import mongoose from 'mongoose';

const memorySchema = mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String },
  coupleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;
