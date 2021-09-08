const utils = {
  isEmpty: (str) => !str,
  isOnlyNumber: (str) => !str.match(/[^0-9]/),
  isValidLength: (str, length) => str.length >= length,
  isValidMaxLength: (str, length) => str.length > length,
  isValidEmail: (str) => /\S+@\S+.\S+/.test(str),
  isOnlyLetters: (str) => !str.match(/[^a-z ]/igm),
  isDoubleSpaced: (str) => str.match('  ') != null,
  isSpaced: (str) => str.match(/[ ]/) != null,
  isOnlyLettersAndDashs: (str) => !str.match(/[^0-9- ]/igm),
  isValidGender: (str) => !str.match(/[^mfo ]/igm)
}

const strings = (string, res, value) => {
  if (string === undefined || utils.isEmpty(string) || !utils.isValidLength(string, 3)) {
    res.statusCode = 406
    res.json({
      status: false,
      msg: 'O campo ' + value + ' deve ter pelo menos 3 caracteres. '
    })
    return false
  }
}

const userValidation = {
  name: (name, res) => {
    strings(name, res, 'Nome')
    return false
  },
  email: (email, res) => {
    if (email === undefined || utils.isEmpty(email) || !utils.isValidLength(email, 2)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O email deve ter mais de 2 caracteres. '
      })
      return false
    } else if (utils.isSpaced(email)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O email não deve ter espaços. '
      })
      return false
    } else if (!utils.isValidEmail(email)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O email deve ser válido. '
      })
      return false
    }
  },
  password: (password, res) => {
    if (!utils.isValidLength(password, 8)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'A senha deve ter pelo menos 8 caracteres. '
      })
      return false
    }
  },
  cpfCnpj: (cpfCnpj, res) => {
    if (cpfCnpj === undefined || utils.isEmpty(cpfCnpj) || !utils.isValidLength(cpfCnpj, 11)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CPF/CNPJ deve conter ao menos 11 números. '
      })
      return false
    } else if (!utils.isOnlyNumber(cpfCnpj)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CPF/CNPJ deve conter apenas números. '
      })
      return false
    } else if (utils.isValidMaxLength(cpfCnpj, 14)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CPF/CNPJ deve conter no máximo 14 números. '
      })
      return false
    }
  },
  cep: (cep, res) => {
    if (cep === undefined || utils.isEmpty(cep) || !utils.isValidLength(cep, 8) || utils.isValidMaxLength(cep, 8)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CEP deve conter 8 números. '
      })
      return false
    } else if (!utils.isOnlyNumber(cep)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CEP deve conter apenas números. '
      })
      return false
    }
  },
  state: (state, res) => {
    strings(state, res, 'Estado')
    return false
  },
  city: (city, res) => {
    strings(city, res, 'Cidade')
    return false
  },
  road: (road, res) => {
    strings(road, res, 'Rua')
    return false
  }
}

const carValidation = {}

module.exports = { userValidation, carValidation }
