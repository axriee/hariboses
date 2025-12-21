import mongoose from 'mongoose';
import { ENV } from '../lib/env.js';


export const connectDB = async () => {
  // Database connection logic here

  try {
    await mongoose.connect(ENV.MONGO_URI)
    console.log('Database connected successfully'); 
  } catch (error) {
    console.log('Database connection failed:', error);
    process.exit(1);
  }
}