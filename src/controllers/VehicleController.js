const Vehicle = require('../models/Vehicle')
const { vehicleValidation } = require('../validations/validation')

class VehicleController {
  async create (req, res) {
    try {
      const { model, brand, year, vehicleType, conservationState, price, steering, transmission, doors, fuel, userId } = req.body
      res.utilized = false
      const priceString = price.toString()
      const doorString = doors.toString()

      vehicleValidation.string(model, res, 'Modelo')
      vehicleValidation.string(brand, res, 'Marca')
      vehicleValidation.year(year, res)
      vehicleValidation.string(vehicleType, res, 'Tipo de veículo')
      vehicleValidation.string(conservationState, res, 'Estado de conservação')
      vehicleValidation.number(priceString, res, 11, 'Preço')
      vehicleValidation.string(steering, res, 'Direção')
      vehicleValidation.string(transmission, res, 'Transmissão')
      vehicleValidation.number(doorString, res, 1, 'Porta')
      vehicleValidation.string(fuel, res, 'Combústivel')

      if (res.utilized === false) {
        const data = {
          model,
          brand,
          year,
          vehicleType,
          conservationState,
          price,
          steering,
          transmission,
          doors,
          fuel,
          user_id: userId
        }

        await Vehicle.create(data)
        res.statusCode = 201
        res.json({ msg: 'Anúncio do Veículo cadastrado.' })
      }
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao criar o anúncio do Veículo: ' + err })
    }
  }

  async findAll (req, res) {
    try {
      const vehicles = await Vehicle.findAll()

      res.statusCode = 200
      res.json({ vehicles })
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao procurar os anúncios do Veículos: ' + err })
    }
  }
}

module.exports = new VehicleController()
