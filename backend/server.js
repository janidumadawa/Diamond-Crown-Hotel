// backend/server.js
const app = require('./src/app');
const connectDatabase = require('./src/config/database');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
});

const PORT = process.env.PORT || 5000;

// Connect to database
connectDatabase();


// Listen on 0.0.0.0 for Railway
// const server = app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
//   console.log(`Environment: ${process.env.NODE_ENV}`);
//   console.log(`API URL: http://0.0.0.0:${PORT}/api`);
// });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1);
    });
});