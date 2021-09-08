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
}

module.exports = new User()
