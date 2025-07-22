import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('ERROR - Uncaught Exception:', err.message);
  console.error('CRITICAL - Shutting down the server due to uncaught exception');
  process.exit(1);
});

// Connect to DB and start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`Server URL: http://localhost:${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('ERROR - Unhandled Promise Rejection:', err.message);
      console.error('CRITICAL - Shutting down the server due to unhandled promise rejection');
      
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });

  })
  .catch((error) => {
    console.error('ERROR - Failed to connect to database:', error.message);
    process.exit(1);
  });
