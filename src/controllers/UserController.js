const User = require('../models/User')
const Vehicle = require('../models/Vehicle')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const { userValidation } = require('../validations/validation')
const PasswordToken = require('../models/PasswordToken')
const transporter = require('../transporter')

const salt = bcrypt.genSaltSync(10)

const secretJwt = process.env.JWT_SECRET

const generate = n => {
  const add = 1
  let max = 12 - add // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return generate(max) + generate(n - max)
  }

  max = Math.pow(10, n + add)
  const min = max / 10 // Math.pow(10, n) basically
  const number = Math.floor(Math.random() * (max - min + 1)) + min

  return ('' + number).substring(add)
}

const sendResponse = (res, code, msg, isNotMessage = false) => {
  if (isNotMessage) {
    res.statusCode = code
    res.json(msg)
    return
  }
  res.statusCode = code
  res.json({ msg: msg })
}

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
          sendResponse(res, 406, 'O email já foi cadastrado anteriormente no sistema. ')
          return
        }

        // se for cnpj
        const hash = await bcrypt.hash(password, salt)
        if (cpfCnpj.length > 11) {
          const cnpjExists = await User.findByCnpj(cpfCnpj)

          // se a consulta de cnpj retornar algo
          if (cnpjExists.length > 0) {
            sendResponse(res, 406, 'O CNPJ já foi cadastrado anteriormente no sistema. ')
            return
          }
          // obj com o novo usuario já validado
          data = { name, phone, password: hash, email, cpf: null, cnpj: cpfCnpj, rating: 0 }
        } else { // se for cpf
          const cpfExists = await User.findByCpf(cpfCnpj)

          // se a consulta de cpf retornar algo
          if (cpfExists.length > 0) {
            sendResponse(res, 406, 'O CPF já foi cadastrado anteriormente no sistema. ')
            return
          }
          // obj com o novo usuario já validado
          data = { name, phone, password: hash, email, cpf: cpfCnpj, cnpj: null, rating: 0 }
        }
        // criacao de usuario de fato
        const userId = await User.create(data)
        await User.createAddress(address, userId)
        sendResponse(res, 201, 'Usuário cadastrado. ID: ' + userId)
      }
    } catch (error) {
      // se qualquer erro nao tratado acontecer
      sendResponse(res, 500, 'Ocorreu um erro ao criar o usuário: ' + error)
    }
  }

  async findAll (req, res) {
    // traz todos os usuários com seus enderecos
    try {
      const users = await User.findAllWithAddress()
      sendResponse(res, 200, users, true)
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao listar os usuários: ' + error)
    }
  }

  async findFavorites (req, res) {
    try {
      const { id } = req.params

      // se o usuário passar algo que não é um numero
      if (!Number(id)) {
        sendResponse(res, 406, 'O parâmetro passado precisa ser um número. ')
        return
      }

      // se o ID do usuário não existir no banco de dados
      const user = await User.findOneWithAddress(id)
      if (user.length === 0) {
        sendResponse(res, 406, 'O ID de usuário indicado não existe no banco de dados. ')
        return
      }

      const result = await User.findFavorites(id)

      sendResponse(res, 200, result, true)
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao listar o usuário: ' + error)
    }
  }

  async findById (req, res) {
    // traz um usuário com seu endereco
    try {
      const { id } = req.params

      // se o usuário passar algo que não é um numero
      if (!Number(id)) {
        sendResponse(res, 406, 'O parâmetro passado precisa ser um número. ')
        return
      }

      // se o ID do usuário não existir no banco de dados
      const user = await User.findOneWithAddress(id)
      if (user.length === 0) {
        sendResponse(res, 406, 'O ID de usuário indicado não existe no banco de dados. ')
        return
      }

      sendResponse(res, 200, user, true)
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao listar o usuário: ' + error)
    }
  }

  async update (req, res) {
    const { id } = req.params

    // se o usuário passar algo que não é um numero
    if (!Number(id)) {
      sendResponse(res, 406, 'O parâmetro passado precisa ser um número. ')
      return
    }

    // se o ID do usuário não existir no banco de dados
    let user = await User.findOneWithAddress(id)
    if (user.length === 0) {
      sendResponse(res, 406, 'O ID de usuário indicado não existe no banco de dados. ')
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
      const emailExists = await User.findByEmail(email)
      if (emailExists.length > 0) {
        sendResponse(res, 406, 'O email inserido já existe no banco de dados. ')
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
        sendResponse(res, 406, 'O CPF já foi cadastrado anteriormente no sistema. ')
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
        sendResponse(res, 406, 'O CNPJ já foi cadastrado anteriormente no sistema. ')
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
      await User.setUnverified(id)

      // printar o usuario com o respectivo endereco
      sendResponse(res, 200, 'Usuário atualizado. ')
    } catch (error) {
      // se algo deu errado nos updates
      sendResponse(res, 500, 'Ocorreu um erro ao atualizar o usuário: ' + error)
    }
  }

  async updateRating (req, res) {
    try {
      const { id } = req.params
      const { rating } = req.body
      res.utilized = false

      // se o parâmetro não for um numero
      if (!Number(id)) {
        sendResponse(res, 406, 'O parâmetro passado precisa ser um número. ')
        return
      }

      // se o id não existir
      const result = await User.findById(id)
      if (result.length === 0) {
        sendResponse(res, 406, 'O ID de usuário indicado não existe no banco de dados. ')
        return
      }

      userValidation.rating(rating, res)
      if (res.utilized) {
        return
      }

      await User.updateRating(id, rating)
      sendResponse(res, 200, 'Rating do usuário atualizado. ')
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao atualizar o rating do usuário: ' + error)
    }
  }

  async delete (req, res) {
    const { id } = req.params

    // se o parâmetro não for um numero
    if (!Number(id)) {
      sendResponse(res, 406, 'O parâmetro passado precisa ser um número. ')
      return
    }

    // se o id não existir
    const result = await User.findById(id)
    if (result.length === 0) {
      sendResponse(res, 406, 'O ID de usuário indicado não existe no banco de dados. ')
      return
    }

    try {
      // deleção do usuário
      await User.delete(id)
      sendResponse(res, 200, 'Usuário deletado. ID: ' + id)
      res.statusCode = 200
      res.json({ msg: 'Usuário deletado. ID: ' + id })
    } catch (error) {
      // deleção com erro
      sendResponse(res, 500, 'Ocorreu um erro ao deletar o usuário: ' + error)
    }
  }

  async setOrUnsetFavorite (req, res) {
    const { id, vehicleId } = req.body

    // se o parâmetro não for um numero
    if (!Number(id) || !Number(vehicleId)) {
      sendResponse(res, 406, 'O parâmetro passado precisa ser um número. ')
      return
    }

    // se o userid não existir
    const resultUser = await User.findById(id)
    if (resultUser.length === 0) {
      sendResponse(res, 406, 'O ID de usuário indicado não existe no banco de dados. ')
      return
    }

    // se o vehicleid não existir
    const resultVehicle = await Vehicle.findById(vehicleId)
    if (resultVehicle.length === 0) {
      sendResponse(res, 406, 'O ID de veículo indicado não existe no banco de dados. ')
      return
    }

    try {
      const isFavorite = await User.findOneFavorite(id, vehicleId)
      if (isFavorite.length === 0) {
        await User.setFavorite(id, vehicleId)
        sendResponse(res, 200, 'Favorido adicionado com sucesso. ID: ' + id + ', vehicleID: ' + vehicleId)
      } else {
        await User.unsetFavorite(id, vehicleId)
        sendResponse(res, 200, 'Favorido removido com sucesso. ID: ' + id + ', vehicleID: ' + vehicleId)
      }
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao (des)favoritar um veículo: ' + error)
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
        sendResponse(res, 200, 'Confira em seu email o token para recuperação de senha. Token: ' + token)
      } else {
        sendResponse(res, 406, 'O email de usuário indicado não existe no banco de dados. ')
      }
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao gerar a recuperação de senha: ' + error)
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
          sendResponse(res, 403, 'O token inserido para a recuperação de senha já foi anteriormente utilizado. ')
        } else {
          userValidation.password(password, res)
          if (res.utilized) {
            return
          }
          const hash = await bcrypt.hash(password, salt)
          await User.changePassword(hash, result.user_id)
          await PasswordToken.setUsed(token)
          sendResponse(res, 200, 'Senha modificada. ')
        }
      } else {
        sendResponse(res, 406, 'O token inserido para a recuperação de senha é invalido. ')
      }
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao recuperar a senha: ' + error)
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
          sendResponse(res, 200, { token: token }, true)
        } else {
          sendResponse(res, 406, 'Credenciais inválidas. ')
        }
      } else {
        sendResponse(res, 406, 'Credenciais inválidas. ')
      }
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao realizar o login: ' + error)
    }
  }

  async findAllOrderByRating (req, res) {
    try {
      const result = await User.findAllOrderByRating()
      sendResponse(res, 200, result, true)
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao requisitar todos os usuários: ' + error)
    }
  }

  async findByIdWithVehicles (req, res) {
    const { id } = req.params

    // se o parâmetro não for um numero
    if (!Number(id)) {
      sendResponse(res, 406, 'O parâmetro passado precisa ser um número. ')
      return
    }

    // se o id não existir
    const result = await User.findById(id)
    if (result.length === 0) {
      sendResponse(res, 406, 'O ID de usuário indicado não existe no banco de dados. ')
      return
    }

    try {
      const userVehicles = await User.findByIdWithVehicles(id)
      const user = {
        id: userVehicles[0].userId,
        vehicles: []
      }
      userVehicles.forEach(vehicle => {
        user.vehicles.push({ id: vehicle.vehicleId })
      })
      sendResponse(res, 200, user, true)
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao requisitar os veículos do usuário: ' + error)
    }
  }

  async sendEmailToVerify (req, res) {
    try {
      const { email } = req.body
      let user = await User.findByEmail(email)
      if (user.length > 0) {
        user = user[0]
        if (!user.verified) {
          if (user.codeToVerify !== '000000') {
            sendResponse(res, 406, 'Um código para a recuperação de senha já foi enviado para esse email.  ')
            return
          }
          const code = generate(6)
          const message = await transporter.sendMail({
            from: 'Marcos Almeida <markosalmeidaa@gmail.com>',
            to: email,
            subject: 'Código para validação de email. ',
            text: 'Aqui está o seu código para validação de email: ' + code + '; Utilize-o apenas uma vez. '
          })
          await User.updateCode(user.id, code)
          console.log(message)
          sendResponse(res, 200, 'Confira no email indicado o código para validação. ')
        } else {
          sendResponse(res, 406, 'O email do usuário indicado já foi verificado anteriormente. ')
        }
      } else {
        sendResponse(res, 406, 'O email de usuário indicado não existe no banco de dados. ')
      }
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao gerar a verificação de email: ' + error)
    }
  }

  async verifyEmail (req, res) {
    try {
      let { code, email } = req.body
      code = code.toString()
      let user = await User.findByEmail(email)
      if (user.length > 0) {
        user = user[0]
        if (user.codeToVerify !== '000000') {
          if (user.codeToVerify === code) {
            await User.verifyEmail(email)
            sendResponse(res, 200, 'Email verificado. Agora você pode fazer consultas antes não liberadas com essa conta. ')
          } else {
            sendResponse(res, 406, 'O código de verificação inserido não condiz com o email informado. ')
          }
        } else {
          sendResponse(res, 406, 'O email de usuário indicado ainda não recebeu um código de verificação. ')
        }
      } else {
        sendResponse(res, 406, 'O email de usuário indicado não existe no banco de dados. ')
      }
    } catch (error) {
      sendResponse(res, 500, 'Ocorreu um erro ao gerar a verificação de email: ' + error)
    }
  }
}

module.exports = new UserController()
