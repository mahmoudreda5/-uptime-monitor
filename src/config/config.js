require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    database: {
      host: process.env.DATABASE_HOST || '127.0.0.1',
      port: process.env.DATABASE_PORT || '27017',
      name: process.env.DATABASE_NAME || 'server-monitor-api',
    },
    jwtSecretKey: process.env.JWT_SECRET_KEY || 'random',
    emailService: process.env.EMAIL_SERVICE || 'gmail',
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD
  };

  module.exports = config;