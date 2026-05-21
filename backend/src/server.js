// Load file .env di baris pertama
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('=========================================');
  console.log(`🚀 Server API berjalan di port ${PORT}`);
  console.log(`🔧 Environment Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 App URL: ${process.env.APP_URL || `http://localhost:${PORT}`}`);
  console.log('=========================================');
});
