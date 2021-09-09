const User = require('../models/User')
const bcrypt = require('bcrypt')
const { userValidation } = require('../validations/validation')
const salt = bcrypt.genSaltSync(10)

class UserController {
  async create (req, res) {
    try {
      const { name, phone, password, email, cpfCnpj, cep, state, city, road, complement } = req.body
      let data = {}
      res.utilized = false

      // com certeza tem como melhorar isso
      userValidation.name(name, res)
      userValidation.phone(phone, res)
      userValidation.email(email, res)
      userValidation.password(password, res)
      userValidation.cpfCnpj(cpfCnpj, res)
      userValidation.cep(cep, res)
      userValidation.state(state, res)
      userValidation.city(city, res)
      userValidation.road(road, res)

      if (res.utilized === false) {
        const address = { cep, state, city, road, complement }
        const emailExists = await User.findByEmail(email)

        if (emailExists.length > 0) {
          res.statusCode = 406
          res.json({ msg: 'O email já foi cadastrado anteriormente no sistema. ' })
          return
        }

        const hash = await bcrypt.hash(password, salt)
        if (cpfCnpj.length > 11) {
          const cnpjExists = await User.findByCnpj(cpfCnpj)

          if (cnpjExists.length > 0) {
            res.statusCode = 406
            res.json({ msg: 'O CNPJ já foi cadastrado anteriormente no sistema. ' })
            return
          }
          data = { name, phone, password: hash, email, cpf: null, cnpj: cpfCnpj, rating: 0 }
        } else {
          const cpfExists = await User.findByCpf(cpfCnpj)

          if (cpfExists.length > 0) {
            res.statusCode = 406
            res.json({ msg: 'O CPF já foi cadastrado anteriormente no sistema. ' })
            return
          }
          data = { name, phone, password: hash, email, cpf: cpfCnpj, cnpj: null, rating: 0 }
        }
        const userId = await User.create(data)
        await User.createAddress(address, userId)
        res.statusCode = 201
        res.json({ msg: 'Usuário cadastrado. ID: ' + userId })
      }
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao criar o usuário: ' + error })
    }
  }

  async findAll (req, res) {
    try {
      const users = await User.findAll()
      res.statusCode = 200
      res.json(users)
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao listar os usuários: ' + error })
    }
  }

  async findById (req, res) {
    try {
      const { id } = req.body.user
      const user = await User.findById(id)
      res.statusCode = 200
      res.json(user)
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao listar o usuário: ' + error })
    }
  }

  async update (req, res) {
    const { id } = req.body
    const user = await User.findById(id)
    const newUser = {}
    const { name, phone, email, cpfCnpj, cep, state, city, road, complement } = req.body

    if (name !== undefined) {
      userValidation.name(name, res)
      if (res.utilized === false) {
        newUser.name = name
      }
    } else {
      newUser.name = user.name
    }

    if (phone !== undefined) {
      newUser.phone = phone
    } else {
      newUser.phone = user.phone
    }

    if (email !== undefined) {
      userValidation.email(email, res)
      if (res.utilized === false) {
        newUser.email = name
      }
    } else {
      newUser.email = user.email
    }

    if (cpfCnpj !== undefined) {
      // tal coisa
    } else {
      // tal coisa
    }

    if (cep !== undefined) {
      // tal coisa
    } else {
      // tal coisa
    }

    if (state !== undefined) {
      // tal coisa
    } else {
      // tal coisa
    }

    if (city !== undefined) {
      // tal coisa
    } else {
      // tal coisa
    }

    if (road !== undefined) {
      // tal coisa
    } else {
      // tal coisa
    }

    if (complement !== undefined) {
      // tal coisa
    } else {
      // tal coisa
    }
  }
}

module.exports = new UserController()
