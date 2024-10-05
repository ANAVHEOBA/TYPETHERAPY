import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const connectToDatabase = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log(`MongoDB connected to ${con.connection.name} database`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if there's an error
  }
};

export default connectToDatabase;
