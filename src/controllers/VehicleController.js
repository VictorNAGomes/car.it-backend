const Car = require('../models/Vehicle')
const { carValidation } = require('../validations/validation')

class VehicleController {
  async create (req, res) {
    try {
      const { model, brand, year, conservationState, price, steering, transmission, doors, fuel, userId } = req.body
      res.utilized = false
      const priceString = price.toString()
      const doorString = doors.toString()

      carValidation.string(model, res, 'Modelo')
      carValidation.string(brand, res, 'Marca')
      carValidation.year(year, res)
      carValidation.string(conservationState, res, 'Estado de conservação')
      carValidation.number(priceString, res, 11, 'Preço')
      carValidation.string(steering, res, 'Direção')
      carValidation.string(transmission, res, 'Transmissão')
      carValidation.number(doorString, res, 1, 'Porta')
      carValidation.string(fuel, res, 'Combústivel')

      if (res.utilized === false) {
        const data = {
          model,
          year,
          conservationState,
          price,
          steering,
          transmission,
          doors,
          fuel,
          user_id: userId
        }

        await Car.create(data)
        res.statusCode = 201
        res.json({ msg: 'Anúncio do Veículo cadastrado.' })
      }
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao criar o anúncio do Veículo: ' + err })
    }
  }
}

module.exports = new VehicleController()
