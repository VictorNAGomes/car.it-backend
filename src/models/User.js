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

  async update (id, newUser) {
    const result = await knex.where({ id: id }).update(newUser).table('users')
    return result
  }

  async updateAddress (id, newAddress) {
    const result = await knex.where({ id: id }).update(newAddress).table('adresses')
    return result
  }

  async updateRating (id, rating) {
    const result = await knex.where({ id: id }).update({ rating: rating }).table('users')
    return result
  }

  async delete (id) {
    const result = await knex.delete().table('users').where({ id: id })
    return result
  }

  async changePassword (password, id) {
    const result = await knex.where({ id: id }).update({ password: password }).table('users')
    return result
  }

  async findAll () {
    const result = await knex.select().table('users')
    return result
  }

  async findById (id) {
    const result = await knex.select().table('users').where({ id: id })
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

  async findOneWithAddress (id) {
    const result = await knex.select().table('users as u').innerJoin('adresses', 'adresses.user_id', 'u.id').whereRaw('u.id = ' + id)
    return result
  }

  async findAllOrderByRating () {
    const result = await knex.select().table('users').orderBy('rating', 'desc')
    return result
  }

  async findAllWithAddress () {
    const result = await knex.select().table('users').innerJoin('adresses', 'adresses.user_id', 'users.id')
    return result
  }

  async findByIdWithVehicles (id) {
    const result = await knex.select('u.id as userId', 'v.id as vehicleId').table('users as u').innerJoin('vehicles as v', 'v.user_id', 'u.id').whereRaw('u.id = ' + id)
    return result
  }
}

module.exports = new User()
