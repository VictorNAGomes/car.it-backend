const Vehicle = require('../models/Vehicle')
const { vehicleValidation } = require('../validations/validation')

class VehicleController {
  async create (req, res) {
    try {
      const { model, brand, year, vehicleType, conservationState, price, steering, transmission, doors, fuel, userId, additionals = [] } = req.body
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

        const vehicle = await Vehicle.create(data)

        for (const add of additionals) {
          const additional = await Vehicle.findAdditionalByName(add)

          const addData = {
            vehicle_id: vehicle[0],
            additional_id: additional[0].id
          }

          await Vehicle.addAdditional(addData)
        }

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
      const vehicleAdd = []

      for (const vehicle of vehicles) {
        const additional = await Vehicle.findVehicleAdd(vehicle.id)
        const additionals = []

        for (const add of additional) {
          additionals.push(add.name)
        }

        const newVehicle = {
          ...vehicle,
          additionals
        }

        vehicleAdd.push(newVehicle)
      }

      res.statusCode = 200
      res.json({ vehicleAdd })
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao procurar os anúncios dos Veículos: ' + err })
    }
  }

  async findById (req, res) {
    try {
      const { id } = req.params
      const vehicle = await Vehicle.findById(id)

      if (vehicle.length > 0) {
        const additional = await Vehicle.findVehicleAdd(id)
        const additionals = []

        for (const add of additional) {
          additionals.push(add.name)
        }

        const vehicleAdd = {
          ...vehicle,
          additionals: additionals
        }

        res.statusCode = 200
        res.json({ vehicleAdd })
      } else {
        res.statusCode = 406
        res.json({ msg: 'Não há veículos cadastrados com esse id' })
      }
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao procurar o anúncio do Veículo: ' + err })
    }
  }
}

module.exports = new VehicleController()
