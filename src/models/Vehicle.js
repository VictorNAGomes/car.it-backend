const knex = require('../database/database')

class Vehicle {
  async create (data) {
    const vehicle = await knex.insert(data).table('vehicles')

    return vehicle
  }
}

module.exports = new Vehicle()
