const User = require('../models/User')
const bcrypt = require('bcrypt')
const { userValidation } = require('../validations/validation')
const salt = bcrypt.genSaltSync(10)

class UserController {
  async create (req, res) {
    try {
      const { name, phone, password, email, cpfCnpj, cep, state, city, district, road, complement } = req.body
      let data = {}
      res.utilized = false

      // validacoes dos campos
      userValidation.name(name, res)
      userValidation.email(email, res)
      userValidation.password(password, res)
      userValidation.cpfCnpj(cpfCnpj, res)
      userValidation.cep(cep, res)
      userValidation.state(state, res)
      userValidation.city(city, res)
      userValidation.road(road, res)

      // se nenhuma validacao deu erro
      if (res.utilized === false) {
        const address = { cep, state, city, district, road, complement }
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

      // se o usuário passar algo que não é um numero
      if (!Number(id)) {
        res.statusCode = 406
        res.json({ msg: 'O parâmetro passado precisa ser um número. ' })
        return
      }

      // se o ID do usuário não existir no banco de dados
      const user = await User.findUserWithAddress(id)
      if (user.length === 0) {
        res.statusCode = 406
        res.json({ msg: 'O ID de usuário indicado não existe no banco de dados. ' })
        return
      }

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
    const { name, phone, email, cpf, cnpj, cep, state, city, district, road, complement } = req.body

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

    if (phone !== undefined) {
      newUser.phone = phone
    } else {
      newUser.phone = user.phone
    }

    if (email !== undefined) {
      userValidation.email(email, res)
      if (res.utilized === false) {
        newUser.email = email
      } else {
        return
      }
    } else {
      newUser.email = user.email
    }

    if (cpf !== undefined && cpf !== null) {
      userValidation.cpfCnpj(cpf, res)
      if (res.utilized === false) {
        newUser.cpf = cpf
      } else {
        return
      }
    } else {
      newUser.cpf = user.cpf
    }

    if (cnpj !== undefined && cnpj !== null) {
      userValidation.cpfCnpj(cnpj, res)
      if (res.utilized === false) {
        newUser.cnpj = cnpj
      } else {
        return
      }
    } else {
      newUser.cnpj = user.cnpj
    }

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

    if (district !== undefined) {
      newAddress.district = district
    } else {
      newAddress.district = user.district
    }

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
      const editedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      newUser.editedAt = editedAt
      console.log(newUser)

      await User.update(id, newUser)
      await User.updateAddress(id, newAddress)

      // printar o usuario com o respectivo endereco
      const userResult = await User.findById(id)
      res.statusCode = 200
      res.json({ msg: 'Usuário atualizado. ', user: userResult })
    } catch (error) {
      // se algo deu errado nos updates
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao atualizar o usuário: ' + error })
    }
  }

  async delete (req, res) {
    const { id } = req.params

    // se o parâmetro não for um numero
    if (!Number(id)) {
      res.statusCode = 406
      res.json({ msg: 'O parâmetro passado precisa ser um número. ' })
      return
    }

    // se o id não existir
    const result = await User.findById(id)
    if (result.length === 0) {
      res.statusCode = 406
      res.json({ msg: 'O ID de usuário indicado não existe no banco de dados. ' })
      return
    }

    try {
      // deleção do usuário
      await User.delete(id)
      res.statusCode = 200
      res.json({ msg: 'Usuário deletado. ID: ' + id })
    } catch (error) {
      // deleção com erro
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao deletar o usuário: ' + error })
    }
  }
}

module.exports = new UserController()
