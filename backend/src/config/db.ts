import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    const conn = await mongoose.connect(mongoUri, {
      // Mongoose 6+ doesn't need these options anymore, but keeping for compatibility
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });

    console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);
    
    // Optional: log the database name
    console.log(`📊 Database: ${conn.connection.name}`);

  } catch (error) {
    console.error(`❌ Database connection error:`, error);
    process.exit(1);
  }
};

// Graceful disconnection
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('📴 MongoDB Disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};
