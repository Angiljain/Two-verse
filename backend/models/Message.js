import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coupleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple', required: true },
  content: { type: String, required: false }, // Made optional so an image-only message works
  imageUrl: { type: String },
  seen: { type: Boolean, default: false },
  mood: { type: String, enum: ['happy', 'sad', 'angry', 'normal'], default: 'normal' }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
