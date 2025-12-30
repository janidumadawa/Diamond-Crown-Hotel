const app = require('./src/app');
const connectDatabase = require('./src/config/database');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
});

// Connect to database (only in non-Vercel environment)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    connectDatabase();
}

const PORT = process.env.PORT || 5000;

// For Vercel deployment, we don't start a server
// Vercel will handle the serverless function invocation
if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
    // Export for Vercel serverless function
    module.exports = app;
} else {
    // Local development - start server normally
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        console.log(`API URL: http://localhost:${PORT}/api`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.log(`ERROR: ${err.message}`);
        console.log('Shutting down the server due to unhandled promise rejection');
        server.close(() => {
            process.exit(1);
        });
    });

    // Export the app for testing
    module.exports = app;
}