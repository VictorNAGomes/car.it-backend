const User = require('../models/User')
const bcrypt = require('bcrypt')
const { userValidation } = require('../validations/validation')
const salt = bcrypt.genSaltSync(10)

class UserController {
  async create (req, res) {
    const { name, phone, password, email, cpfCnpj, cep, state, city, road, complement } = req.body
    let data = {}

    // com certeza tem como melhorar isso
    userValidation.name(name, res)
    userValidation.email(email, res)
    userValidation.password(password, res)
    userValidation.cpfCnpj(cpfCnpj, res)
    userValidation.cep(cep, res)
    userValidation.state(state, res)
    userValidation.city(city, res)
    userValidation.road(road, res)

    // verificar os campos do address
    const address = { cep, state, city, road, complement }

    // verificar se o email já existe no banco
    const hash = await bcrypt.hash(password, salt)

    if (cpfCnpj.length > 11) {
      // verificar se o cnpj existe
      data = { name, phone, password: hash, email, cpf: null, cnpj: cpfCnpj, rating: 0 }
    } else {
      // verificar se o cpf existe
      data = { name, phone, password: hash, email, cpf: cpfCnpj, cnpj: null, rating: 0 }
    }

    try {
      const userId = await User.create(data)
      await User.createAddress(address, userId)
      res.statusCode = 200
      res.json({ msg: 'Usuário cadastrado. ID: ' + userId })
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao criar o usuário: ' + error })
    }
  }
}

module.exports = new UserController()
