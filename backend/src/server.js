import app from './app.js';
import connectDB from './config/db.js';
import config from './config/index.js';

// Connect to database
connectDB();

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🐝 Fit-Bees API Server                          ║
  ║                                                   ║
  ║   Environment: ${config.nodeEnv.padEnd(32)}║
  ║   Port: ${PORT.toString().padEnd(40)}║
  ║   URL: http://localhost:${PORT.toString().padEnd(23)}║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
