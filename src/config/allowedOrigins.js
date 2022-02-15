const allowedOrigins = [
    'http://localhost:5500',
    `${process.env.CLIENT_URL}`
  ];
  
  module.exports = allowedOrigins;