const jwt = require('jsonwebtoken')

function verifyToken (req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).send({
      auth: false,
      message: 'No token provided.'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        auth: false,
        message: 'Failed to authenticate. Error -> ' + err
      })
    }
    req.userId = decoded.id
    next()
  })
}

module.exports = verifyToken
