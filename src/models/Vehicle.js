const knex = require('../database/database')

class Vehicle {
  async create (data) {
    const vehicle = await knex.insert(data).table('vehicles')

    return vehicle
  }

  async findAll () {
    const vehicles = await knex.select().table('vehicles')

    return vehicles
  }

  async findById (id) {
    const vehicle = await knex.select().table('vehicles').where({ id: id })

    return vehicle
  }

  async findAdditionalByName (name) {
    const additional = await knex.select().table('additionals').where({ name: name })

    return additional
  }

  async addAdditional (data) {
    const additional = await knex.insert(data).table('vehicle_additional')

    return additional
  }

  async findVehicleAdd (vehicleId) {
    const addAdditionals = await knex.select()
      .innerJoin('Additionals', 'additionals.id', 'vehicle_additional.additional_id')
      .table('vehicle_additional')
      .where('vehicle_id', vehicleId)

    return addAdditionals
  }

  async deleteAdd (vehicleId) {
    const additional = await knex.delete().table('vehicle_additional').where({ vehicle_id: vehicleId })

    return additional
  }

  async update (data, id) {
    const vehicle = await knex.update(data).table('vehicles').where({ id: id })

    return vehicle
  }

  async delete (id) {
    const vehicle = await knex.delete().table('vehicles').where({ id: id })

    return vehicle
  }

  async findAllCars () {
    const vehicles = await knex.select().table('vehicles').where({ vehicleType: 'Carro' })

    return vehicles
  }

  async findAllMotorcycles () {
    const vehicles = await knex.select().table('vehicles').where({ vehicleType: 'Moto' })

    return vehicles
  }

  async findWithCategories (categories, price, year, additionals) {
    const vehicles = await knex.select('vehicles.*')
      .table('vehicles')
      .leftJoin('vehicle_additional', 'vehicle_additional.id', 'vehicles.id')
      .where(categories)
      .whereRaw('price >= ? and price <= ?', [price.minPrice, price.maxPrice])
      .whereRaw('year >= ? and year <= ?', [year.minYear, year.maxYear])
      .whereIn('additional_id', additionals)

    return vehicles
  }

  async findAllCarsByUserId (id) {
    const vehicles = await knex.select().table('vehicles').where({ user_id: id })

    return vehicles
  }

  async findAllCarsFavoritedById (id) {
    let vehicles = await knex.raw('select vehicles.* from vehicles, favorites where vehicles.id = favorites.vehicle_id and favorites.user_id = ' + id)
    vehicles = vehicles[0]

    return vehicles
  }

  async insertImage (data) {
    const image = await knex.insert(data).table('vehicle_image')
    return image
  }

  async getImages (id) {
    const image = await knex.where({ vehicle_id: id }).select().table('vehicle_image')
    return image
  }

  async deleteImage (id) {
    const image = await knex.where({ id: id }).delete().table('vehicle_image')
    return image
  }

  async getSingleImage (id) {
    const image = await knex.where({ id: id }).select().table('vehicle_image')
    return image
  }
}

module.exports = new Vehicle()
