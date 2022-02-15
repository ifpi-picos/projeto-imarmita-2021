const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, // token in cookie
  methods: 'GET,PUT,POST,OPTIONS, DELETE',
  allowedHeaders: 'Accept,Content-Type,Authorization'
}

module.exports = corsOptions
