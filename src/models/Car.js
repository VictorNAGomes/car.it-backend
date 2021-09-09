const knex = require('../database/database')

class Car {
  async create (data) {
    const car = await knex.insert(data).table('cars')

    return car
  }
}

module.exports = new Car()
