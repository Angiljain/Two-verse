import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const conn = await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB');

const Memory = (await import('./models/Memory.js')).default;
const all = await Memory.find({}).lean();

console.log('Total memories in DB:', all.length);
for (const m of all) {
  console.log('---');
  console.log('  _id:', m._id.toString());
  console.log('  coupleId:', m.coupleId ? m.coupleId.toString() : 'NULL');
  console.log('  url:', m.url ? m.url.substring(0, 80) : 'NULL');
}

await mongoose.disconnect();
process.exit(0);
