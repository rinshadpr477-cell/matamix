import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export async function connectDB(uri?: string): Promise<typeof mongoose> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const targetUri = uri || env.MONGODB_URI;

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('🔌 MongoDB disconnected gracefully');
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  if (env.NODE_ENV !== 'test') {
    console.warn('⚠️ MongoDB connection lost. Reconnecting...');
  }
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err);
});
