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

  async findCars () {
    const vehicles = await knex.select().table('vehicles').where({ vehicleType: 'Carro' })

    return vehicles
  }
}

module.exports = new Vehicle()
