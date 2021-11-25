const knex = require('../database/database')
const Vehicle = require('../models/Vehicle')

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

  async updateCode (id, code) {
    const result = await knex.where({ id: id }).update({ codeToVerify: code }).table('users')
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

  async setFavorite (id, vehicleId) {
    const result = await knex.insert({ user_id: id, vehicle_id: vehicleId }).table('favorites')
    return result
  }

  async unsetFavorite (id, vehicleId) {
    const result = await knex.delete().table('favorites').whereRaw('user_id = ' + id + ' and vehicle_id = ' + vehicleId)
    return result
  }

  async findAll () {
    const result = await knex.select('id', 'name', 'phone', 'email', 'cpf', 'cnpj', 'rating', 'verified', 'hasAddress').table('users')
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
    const result = await Vehicle.findAllCarsByUserId(id)
    return result
  }

  async findFavorites (id) {
    const result = await Vehicle.findAllCarsFavoritedById(id)
    return result
  }

  async findOneFavorite (id, vehicleId) {
    const result = await knex.select('u.id as userId', 'v.id as vehicleId').from(knex.raw('users as u, vehicles as v, favorites as f')).whereRaw('? = u.id and u.id = f.user_id and f.vehicle_id = v.id and v.id = ?', [id, vehicleId])
    return result
  }

  async verifyEmail (email) {
    const result = await knex.where({ email: email }).update({ verified: 1, codeToVerify: '000000' }).table('users')
    return result
  }

  async hasAddress (id) {
    const result = await knex.where({ id: id }).update({ hasAddress: 1 }).table('users')
    return result
  }

  async setUnverified (id) {
    const result = await knex.where({ id: id }).update({ verified: 0, codeToVerify: '000000' }).table('users')
    return result
  }

  async insertImage (data) {
    const image = await knex.insert(data).table('user_image')
    return image
  }

  async getImage (id) {
    const image = await knex.where({ user_id: id }).select().table('user_image')
    return image
  }

  async updateImage (data) {
    const image = await knex.where({ user_id: data.user_id }).update(data).table('user_image')
    return image
  }

  async deleteImage (id) {
    const image = await knex.where({ user_id: id }).delete().table('user_image')
    return image
  }
}

module.exports = new User()
