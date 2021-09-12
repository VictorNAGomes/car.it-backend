const JWT = require('jsonwebtoken')
const secretJwt = process.env.JWT_SECRET

module.exports = function (req, res, next) {
  const authToken = req.headers.authorization
  if (authToken !== undefined) {
    const bearer = authToken.split(' ')
    const token = bearer[1]
    try {
      const decoded = JWT.verify(token, secretJwt)
      console.log(decoded)
      next()
    } catch (error) {
      res.statusCode = 403
      res.json({ msg: 'O cliente precisa estar logado para fazer essa requisição. ' })
    }
  } else {
    res.statusCode = 403
    res.json({ msg: 'O cliente precisa estar logado para fazer essa requisição. ' })
  }
}
