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

      // validacoes dos campos
      userValidation.name(name, res)
      userValidation.phone(phone, res)
      userValidation.email(email, res)
      userValidation.password(password, res)
      userValidation.cpfCnpj(cpfCnpj, res)
      userValidation.cep(cep, res)
      userValidation.state(state, res)
      userValidation.city(city, res)
      userValidation.road(road, res)

      // se nenhuma validacao deu erro
      if (res.utilized === false) {
        const address = { cep, state, city, road, complement }
        const emailExists = await User.findByEmail(email)

        // se a consulta de email retornar algo
        if (emailExists.length > 0) {
          res.statusCode = 406
          res.json({ msg: 'O email já foi cadastrado anteriormente no sistema. ' })
          return
        }

        // se for cnpj
        const hash = await bcrypt.hash(password, salt)
        if (cpfCnpj.length > 11) {
          const cnpjExists = await User.findByCnpj(cpfCnpj)

          // se a consulta de cnpj retornar algo
          if (cnpjExists.length > 0) {
            res.statusCode = 406
            res.json({ msg: 'O CNPJ já foi cadastrado anteriormente no sistema. ' })
            return
          }
          // obj com o novo usuario já validado
          data = { name, phone, password: hash, email, cpf: null, cnpj: cpfCnpj, rating: 0 }
        } else { // se for cpf
          const cpfExists = await User.findByCpf(cpfCnpj)

          // se a consulta de cpf retornar algo
          if (cpfExists.length > 0) {
            res.statusCode = 406
            res.json({ msg: 'O CPF já foi cadastrado anteriormente no sistema. ' })
            return
          }
          // obj com o novo usuario já validado
          data = { name, phone, password: hash, email, cpf: cpfCnpj, cnpj: null, rating: 0 }
        }
        // criacao de usuario de fato
        const userId = await User.create(data)
        await User.createAddress(address, userId)
        res.statusCode = 201
        res.json({ msg: 'Usuário cadastrado. ID: ' + userId })
      }
    } catch (error) {
      // se qualquer erro nao tratado acontecer
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao criar o usuário: ' + error })
    }
  }

  async findAll (req, res) {
    // traz todos os usuários com seus enderecos
    try {
      const users = await User.findUsersWithAddress()
      res.statusCode = 200
      res.json(users)
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao listar os usuários: ' + error })
    }
  }

  async findById (req, res) {
    // traz um usuário com seu endereco
    try {
      const { id } = req.params
      const user = await User.findUserWithAddress(id)
      res.statusCode = 200
      res.json(user)
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao listar o usuário: ' + error })
    }
  }

  async update (req, res) {
    const { id } = req.params

    // se o usuário passar algo que não é um numero
    if (!Number(id)) {
      res.statusCode = 406
      res.json({ msg: 'O parâmetro passado precisa ser um número. ' })
      return
    }

    // se o ID do usuário não existir no banco de dados
    let user = await User.findUserWithAddress(id)
    if (user.length === 0) {
      res.statusCode = 406
      res.json({ msg: 'O ID de usuário indicado não existe no banco de dados. ' })
      return
    }

    user = user[0]
    const newUser = {}
    const newAddress = {}
    const { name, phone, email, cpf, cnpj, cep, state, city, road, complement } = req.body

    // VALIDACOES
    res.utilized = false
    if (name !== undefined) {
      userValidation.name(name, res)
      if (res.utilized === false) {
        newUser.name = name
      } else {
        return
      }
    } else {
      newUser.name = user.name
    }

    res.utilized = false
    if (phone !== undefined) {
      newUser.phone = phone
    } else {
      newUser.phone = user.phone
    }

    res.utilized = false
    if (email !== undefined) {
      userValidation.email(email, res)
      if (res.utilized === false) {
        newUser.email = name
      } else {
        return
      }
    } else {
      newUser.email = user.email
    }

    res.utilized = false
    if (cpf !== undefined) {
      userValidation.cpfCnpj(cpf, res)
      if (res.utilized === false) {
        newUser.cpf = cpf
      } else {
        return
      }
    } else {
      newUser.cpf = user.cpf
    }

    res.utilized = false
    if (cnpj !== undefined) {
      userValidation.cpfCnpj(cnpj, res)
      if (res.utilized === false) {
        newUser.cnpj = cnpj
      } else {
        return
      }
    } else {
      newUser.cnpj = user.cnpj
    }

    res.utilized = false
    if (cep !== undefined) {
      userValidation.cep(cep, res)
      if (res.utilized === false) {
        newAddress.cep = cep
      } else {
        return
      }
    } else {
      newAddress.cep = user.cep
    }

    res.utilized = false
    if (state !== undefined) {
      userValidation.state(state, res)
      if (res.utilized === false) {
        newAddress.state = state
      } else {
        return
      }
    } else {
      newAddress.state = user.state
    }

    res.utilized = false
    if (city !== undefined) {
      userValidation.city(city, res)
      if (res.utilized === false) {
        newAddress.city = city
      } else {
        return
      }
    } else {
      newAddress.city = user.city
    }

    res.utilized = false
    if (road !== undefined) {
      userValidation.road(road, res)
      if (res.utilized === false) {
        newAddress.road = road
      } else {
        return
      }
    } else {
      newAddress.road = user.road
    }

    if (complement !== undefined) {
      newAddress.complement = complement
    } else {
      newAddress.complement = user.complement
    }

    try {
      // updates de fato
      await User.update(id, newUser)
      await User.updateAddress(id, newAddress)

      // printar o usuario com o respectivo endereco
      const user = await User.findUserWithAddress(id)
      res.statusCode = 200
      res.json({ msg: 'Usuário atualizado. ', user: user })
    } catch (error) {
      // se algo deu errado nos updates
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao atualizar o usuário: ' + error })
    }
  }
}

module.exports = new UserController()
