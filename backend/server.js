const app = require('./src/app');
const connectDatabase = require('./src/config/database');

//   ERROR HANDLING
process.on('uncaughtException', (err) => {
  console.error('ERROR:', err.message);
  process.exit(1);
});


   //DATABASE CONNECTION(Vercel-safe)
 
if (!process.env.VERCEL) {
  connectDatabase();
}


//   LOCAL SERVER ONLY
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('ERROR:', err.message);
    server.close(() => process.exit(1));
  });
}

//    EXPORT FOR VERCEl
module.exports = app;
