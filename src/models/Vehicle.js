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
}

module.exports = new Vehicle()
