const JWT = require('jsonwebtoken')
const User = require('../models/User')
const secretJwt = process.env.JWT_SECRET

module.exports = async function (req, res, next) {
  const idRequest = req.params.id

  if (!Number(idRequest)) {
    res.statusCode = 406
    res.json({ msg: 'O parâmetro passado precisa ser um número. ' })
    return
  }

  // se o ID do usuário não existir no banco de dados
  User.findById(idRequest).then((data) => {
    if (data.length === 0) {
      res.statusCode = 406
      res.json({ msg: 'O ID de usuário indicado não existe no banco de dados. ' })
    }
  })

  const authToken = req.headers.authorization
  if (authToken !== undefined) {
    const bearer = authToken.split(' ')
    const token = bearer[1]
    try {
      const user = await User.findById(idRequest)
      const decoded = JWT.verify(token, secretJwt)
      if (user[0].email === decoded.email) {
        next()
      } else {
        res.statusCode = 406
        res.json({ msg: 'O usuário está logado, porém está fazendo requisições em informações de outra conta. ' })
      }
    } catch (error) {
      res.statusCode = 403
      res.json({ msg: 'O cliente precisa estar logado para fazer essa requisição. ' + error })
    }
  } else {
    res.statusCode = 403
    res.json({ msg: 'O cliente precisa estar logado para fazer essa requisição. ' })
  }
}
