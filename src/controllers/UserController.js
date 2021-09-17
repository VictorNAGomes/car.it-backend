const User = require('../models/User')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const { userValidation } = require('../validations/validation')
const PasswordToken = require('../models/PasswordToken')
const transporter = require('../transporter')

const salt = bcrypt.genSaltSync(10)

const secretJwt = process.env.JWT_SECRET

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
      const users = await User.findAllWithAddress()
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
      const user = await User.findOneWithAddress(id)
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
    let user = await User.findOneWithAddress(id)
    if (user.length === 0) {
      res.statusCode = 406
      res.json({ msg: 'O ID de usuário indicado não existe no banco de dados. ' })
      return
    }

    user = user[0]
    let { name = user.name, phone = user.phone, email = user.email, cpf = user.cpf, cnpj = user.cnpj, cep = user.cep, state = user.state, city = user.city, district = user.district, road = user.road, complement = user.complement } = req.body
    if (cpf === null) {
      cpf = user.cpf
    }
    if (cnpj === null) {
      cnpj = user.cnpj
    }
    const newUser = {
      name,
      phone,
      email,
      cpf,
      cnpj
    }
    const newAddress = {
      cep,
      state,
      city,
      district,
      road,
      complement
    }

    // VALIDACOES
    res.utilized = false
    if (name !== user.name) {
      userValidation.name(name, res)
      if (res.utilized) {
        return
      }
    }

    if (email !== user.email) {
      userValidation.email(email, res)
      if (res.utilized) {
        return
      }
    }

    if (cpf !== user.cpf && cpf !== null) {
      userValidation.cpfCnpj(cpf, res, 'cpf')
      if (res.utilized) {
        return
      }
      const cpfExists = await User.findByCpf(cpf)
      if (cpfExists.length > 0) {
        res.statusCode = 406
        res.json({ msg: 'O CPF já foi cadastrado anteriormente no sistema. ' })
        return
      }
    }

    if (cnpj !== user.cnpj && cnpj !== null) {
      userValidation.cpfCnpj(cnpj, res, 'cnpj')
      if (res.utilized) {
        return
      }
      const cnpjExists = await User.findByCnpj(cnpj)
      if (cnpjExists.length > 0) {
        res.statusCode = 406
        res.json({ msg: 'O CNPJ já foi cadastrado anteriormente no sistema. ' })
        return
      }
    }

    if (cep !== user.cep) {
      userValidation.cep(cep, res)
      if (res.utilized) {
        return
      }
    }

    if (state !== user.state) {
      userValidation.state(state, res)
      if (res.utilized) {
        return
      }
    }

    if (city !== user.city) {
      userValidation.city(city, res)
      if (res.utilized) {
        return
      }
    }

    if (road !== user.road) {
      userValidation.road(road, res)
      if (res.utilized) {
        return
      }
    }

    try {
      // updates de fato
      const editedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      newUser.editedAt = editedAt

      await User.update(id, newUser)
      await User.updateAddress(id, newAddress)

      // printar o usuario com o respectivo endereco
      const userResult = await User.findOneWithAddress(id)
      res.statusCode = 200
      res.json({ msg: 'Usuário atualizado. ', user: userResult })
    } catch (error) {
      // se algo deu errado nos updates
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao atualizar o usuário: ' + error })
    }
  }

  async updateRating (req, res) {
    try {
      const { id } = req.params
      const { rating } = req.body
      res.utilized = false

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

      userValidation.rating(rating, res)
      if (res.utilized) {
        return
      }

      await User.updateRating(id, rating)
      res.statusCode = 200
      res.json({ msg: 'Rating do usuário atualizado. ' })
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao atualizar o rating do usuário: ' + error })
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

  async recoverPassword (req, res) {
    try {
      const { email } = req.body
      const user = await User.findByEmail(email)
      if (user.length > 0) {
        const token = await PasswordToken.create(user[0])
        const message = await transporter.sendMail({
          from: 'Marcos Almeida <markosalmeidaa@gmail.com>',
          to: email,
          subject: 'Token para recuperação de senha. ',
          text: 'Aqui está o seu token para recuperação de senha: ' + token + '; Utilize-o apenas uma vez. '
        })
        console.log(message)
        res.statusCode = 200
        res.json({ msg: 'Confira em seu email o token para recuperação de senha. Token: ' + token })
      } else {
        res.statusCode = 406
        res.json({ msg: 'O email de usuário indicado não existe no banco de dados. ' })
      }
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao gerar a recuperação de senha: ' + error })
    }
  }

  async changePassword (req, res) {
    const { token, password } = req.body
    res.utilized = false
    try {
      let result = await PasswordToken.findByToken(token)
      if (result.length > 0) {
        result = result[0]
        if (result.used) {
          res.statusCode = 403
          res.json({ msg: 'O token inserido para a recuperação de senha já foi anteriormente utilizado. ' })
        } else {
          userValidation.password(password, res)
          if (res.utilized) {
            return
          }
          const hash = await bcrypt.hash(password, salt)
          await User.changePassword(hash, result.user_id)
          await PasswordToken.setUsed(token)
          res.statusCode = 200
          res.json({ msg: 'Senha modificada. ' })
        }
      } else {
        res.statusCode = 406
        res.json({ msg: 'O token inserido para a recuperação de senha é invalido. ' })
      }
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao recuperar a senha: ' + error })
    }
  }

  async login (req, res) {
    try {
      const { email, password } = req.body

      userValidation.email(email, res)
      if (res.utilized) {
        return
      }

      let user = await User.findByEmail(email)
      user = user[0]
      if (user !== undefined) {
        const result = await bcrypt.compare(password, user.password)
        if (result) {
          const token = JWT.sign({ email: email }, secretJwt)
          res.statusCode = 200
          res.json({ token: token })
        } else {
          res.statusCode = 406
          res.json({ msg: 'Credenciais inválidas. ' })
        }
      } else {
        res.statusCode = 406
        res.json({ msg: 'Credenciais inválidas. ' })
      }
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao realizar o login: ' + error })
    }
  }

  async findAllOrderByRating (req, res) {
    try {
      const result = await User.findAllOrderByRating()
      res.statusCode = 200
      res.json(result)
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao requisitar todos os usuários: ' + error })
    }
  }

  async findByIdWithVehicles (req, res) {
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
      const userVehicles = await User.findByIdWithVehicles(id)
      res.statusCode = 200
      res.json(userVehicles)
    } catch (error) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao requisitar os veículos do usuário: ' + error })
    }
  }
}

module.exports = new UserController()
