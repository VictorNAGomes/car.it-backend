const knex = require('../database/database')
const { v4: uuidv4 } = require('uuid')

class PasswordToken {
  async create (user) {
    const token = uuidv4()
    await knex.insert({ user_id: user.id, used: 0, token: token }).table('passwordTokens')
    return token // isso deverá ir para o email de quem fez a requisição
  }

  async findByToken (token) {
    const result = await knex.select().where({ token: token }).table('passwordTokens')
    return result
  }

  async setUsed (token) {
    const result = await knex.where({ token: token }).update({ used: 1 }).table('passwordTokens')
    return result
  }
}

module.exports = new PasswordToken()
