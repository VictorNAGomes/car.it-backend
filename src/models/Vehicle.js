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
}

module.exports = new Vehicle()
