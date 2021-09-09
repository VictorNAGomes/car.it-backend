const knex = require('../database/database')

class User {
  async create (data) {
    const userId = await knex.insert(data).table('users')
    return userId
  }

  async createAddress (address, userId) {
    address.user_id = userId
    await knex.insert(address).table('adresses')
  }

  async findAll () {
    const result = await knex.select().table('users')
    return result
  }

  async findByCpf (cpf) {
    const result = await knex.select().table('users').where({ cpf: cpf })
    return result
  }

  async findByCnpj (cnpj) {
    const result = await knex.select().table('users').where({ cnpj: cnpj })
    return result
  }

  async findByEmail (email) {
    const result = await knex.select().table('users').where({ email: email })
    return result
  }
}

module.exports = new User()
