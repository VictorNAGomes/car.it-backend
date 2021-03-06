const utils = {
  isEmpty: (str) => !str,
  isOnlyNumber: (str) => !str.match(/[^0-9]/),
  isValidLength: (str, length) => str.length >= length,
  isValidMaxLength: (str, length) => str.length <= length,
  isValidEmail: (str) => /\S+@\S+.\S+/.test(str),
  isOnlyLetters: (str) => !str.match(/[^a-z ]/igm),
  isDoubleSpaced: (str) => str.match('  ') != null,
  isSpaced: (str) => str.match(/[ ]/) != null,
  isOnlyLettersAndDashs: (str) => !str.match(/[^a-z- ]/igm),
  isValidGender: (str) => !str.match(/[^mfo ]/igm)
}

const strings = (string, res, value, length) => {
  if (string === undefined || utils.isEmpty(string) || !utils.isValidLength(string, length)) {
    res.statusCode = 406
    res.json({
      status: false,
      msg: 'O campo ' + value + ' deve ter pelo menos ' + length + ' caracteres. '
    })
    res.utilized = true
    return false
  }
}

const userValidation = {
  name: (name, res) => {
    if (name === undefined || utils.isEmpty(name)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O nome não pode ser vazio. '
      })
      res.utilized = true
      return false
    } else if (!utils.isOnlyLettersAndDashs(name)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O nome não pode conter caracteres especiais. '
      })
      res.utilized = true
      return false
    } else {
      strings(name, res, 'Nome', 3)
    }
  },
  email: (email, res) => {
    if (email === undefined || utils.isEmpty(email) || !utils.isValidLength(email, 2)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O email deve ter mais de 2 caracteres. '
      })
      res.utilized = true
      return false
    } else if (utils.isSpaced(email)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O email não deve ter espaços. '
      })
      res.utilized = true
      return false
    } else if (!utils.isValidEmail(email)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O email deve ser válido. '
      })
      res.utilized = true
      return false
    }
  },
  password: (password, res) => {
    if (password === undefined || utils.isEmpty(password) || !utils.isValidLength(password, 8)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'A senha deve ter pelo menos 8 caracteres. '
      })
      res.utilized = true
      return false
    }
  },
  cpfCnpj: (cpfCnpj, res, str) => {
    if (cpfCnpj === undefined || utils.isEmpty(cpfCnpj)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CPF/CNPJ deve conter ao menos 11 números. '
      })
      res.utilized = true
      return false
    } else if (!utils.isOnlyNumber(cpfCnpj)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CPF/CNPJ deve conter apenas números. '
      })
      res.utilized = true
      return false
    } else if (str === 'cpf' && !utils.isValidMaxLength(cpfCnpj, 11)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CPF deve conter 11 números. '
      })
      res.utilized = true
      return false
    } else if (str === 'cnpj' && !utils.isValidMaxLength(cpfCnpj, 14)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CNPJ deve conter 14 números. '
      })
      res.utilized = true
      return false
    }
  },
  cep: (cep, res) => {
    if (cep === undefined || utils.isEmpty(cep) || !utils.isValidLength(cep, 8) || !utils.isValidMaxLength(cep, 8)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CEP deve conter 8 números. '
      })
      res.utilized = true
      return false
    } else if (!utils.isOnlyNumber(cep)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O CEP deve conter apenas números. '
      })
      res.utilized = true
      return false
    }
  },
  rating: (rating, res) => {
    if (rating === undefined || utils.isEmpty(rating) || !Number(rating)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O rating deve ser numérico. '
      })
      res.utilized = true
      return false
    } else if (rating > 5) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O rating deve ser menor ou igual a 5. '
      })
      res.utilized = true
      return false
    } else if (rating < 0) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O rating deve ser maior ou igual a 0. '
      })
      res.utilized = true
      return false
    }
  },
  state: (state, res) => {
    strings(state, res, 'Estado', 3)
  },
  city: (city, res) => {
    strings(city, res, 'Cidade', 3)
  },
  road: (road, res) => {
    strings(road, res, 'Rua', 3)
  }
}

const vehicleValidation = {
  string: (string, res, value) => {
    strings(string, res, value, 2)
    if (utils.isDoubleSpaced(string) && res.utilized === false) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O campo ' + value + ' não deve ter mais de um espaço entre as palavras'
      })
      res.utilized = true
    }
  },
  year: (year, res) => {
    if (!utils.isValidLength(year, 4) || !utils.isValidMaxLength(year, 4)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O campo Ano deve ter 4 caracteres'
      })
      res.utilized = true
    }
  },
  number: (price, res, length, value) => {
    if (!utils.isValidMaxLength(price, length)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O ' + value + ' deve ter no máximo ' + length + ' caracteres'
      })
      res.utilized = true
    }
  }
}

module.exports = { userValidation, vehicleValidation }
