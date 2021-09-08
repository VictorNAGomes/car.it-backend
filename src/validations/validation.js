const utils = {
  isEmpty: (str) => !str,
  isOnlyNumber: (str) => !str.match(/[^0-9]/),
  isValidLength: (str, length) => str.length >= length,
  isValidEmail: (str) => /\S+@\S+.\S+/.test(str),
  isOnlyLetters: (str) => !str.match(/[^a-z ]/igm),
  isDoubleSpaced: (str) => str.match('  ') != null,
  isSpaced: (str) => str.match(/[ ]/) != null,
  isOnlyLettersAndDashs: (str) => !str.match(/[^0-9- ]/igm),
  isValidGender: (str) => !str.match(/[^mfo ]/igm)
}

const userValidation = {
  userName: (userName, res) => {
    if (userName === undefined || utils.isEmpty(userName) || !utils.isValidLength(userName, 3)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O nome de usuário deve ter pelo menos 3 caracteres'
      })
      return false
    } else if (utils.isSpaced(userName)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O nome de usuário não deve ter espaços'
      })
      return false
    }
  },
  email: (email, res) => {
    if (email === undefined || utils.isEmpty(email) || !utils.isValidLength(email, 2)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O email deve ter mais de 2 caracteres'
      })
      return false
    } else if (utils.isSpaced(email)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'O email não deve ter espaços'
      })
      return false
    } else if (!utils.isValidEmail(email)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'Digite um email válido'
      })
      return false
    }
  },
  password: (password, res) => {
    if (!utils.isValidLength(password, 8)) {
      res.statusCode = 406
      res.json({
        status: false,
        msg: 'A senha deve ter pelo menos 8 caracteres'
      })
      return false
    }
  }
}

const carValidation = {}

module.exports = { userValidation, carValidation }
