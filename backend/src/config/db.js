import mongoose from 'mongoose';

export async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/photo_erp';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}
