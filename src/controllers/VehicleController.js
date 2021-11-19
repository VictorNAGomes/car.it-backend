const Vehicle = require('../models/Vehicle')
const { vehicleValidation } = require('../validations/validation')

class VehicleController {
  async create (req, res) {
    try {
      const { model, brand, year, vehicleType, conservationState, price, steering, transmission, doors, fuel, description, userId, additionals = [] } = req.body
      res.utilized = false
      const priceString = price.toString()
      const doorString = doors.toString()

      vehicleValidation.string(model, res, 'Modelo')
      vehicleValidation.string(brand, res, 'Marca')
      vehicleValidation.year(year, res)
      vehicleValidation.string(vehicleType, res, 'Tipo de veículo')
      vehicleValidation.string(conservationState, res, 'Estado de conservação')
      vehicleValidation.number(priceString, res, 9, 'Preço')
      vehicleValidation.string(steering, res, 'Direção')
      vehicleValidation.string(transmission, res, 'Transmissão')
      vehicleValidation.number(doorString, res, 1, 'Porta')
      vehicleValidation.string(fuel, res, 'Combústivel')
      vehicleValidation.string(description, res, 'Descrição')

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
          description,
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
      res.json({ vehicles: vehicleAdd })
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
          ...vehicle[0],
          additionals: additionals
        }

        res.statusCode = 200
        res.json({ vehicle: vehicleAdd })
      } else {
        res.statusCode = 406
        res.json({ msg: 'Não há veículos cadastrados com esse id' })
      }
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao procurar o anúncio do Veículo: ' + err })
    }
  }

  async update (req, res) {
    try {
      const { id } = req.params
      const { model, brand, year, vehicleType, conservationState, price, steering, transmission, doors, fuel, description, additionals = [] } = req.body
      res.utilized = false

      const vehicle = await Vehicle.findById(id)

      const editedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')

      if (vehicle.length > 0) {
        const data = {
          id: vehicle[0].id,
          model: vehicle[0].model,
          brand: vehicle[0].brand,
          year: vehicle[0].year,
          vehicleType: vehicle[0].vehicleType,
          conservationState: vehicle[0].conservationState,
          price: vehicle[0].price,
          steering: vehicle[0].steering,
          transmission: vehicle[0].transmission,
          doors: vehicle[0].doors,
          fuel: vehicle[0].fuel,
          description: vehicle[0].description,
          editedAt: editedAt,
          user_id: vehicle[0].user_id
        }

        if (model !== undefined) {
          vehicleValidation.string(model, res, 'Modelo')
          data.model = model
        }
        if (brand !== undefined) {
          vehicleValidation.string(brand, res, 'Marca')
          data.brand = brand
        }
        if (year !== undefined) {
          vehicleValidation.year(year, res)
          data.year = year
        }
        if (vehicleType !== undefined) {
          vehicleValidation.string(vehicleType, res, 'Tipo de veículo')
          data.vehicleType = vehicleType
        }
        if (conservationState !== undefined) {
          vehicleValidation.string(conservationState, res, 'Estado de conservação')
          data.conservationState = conservationState
        }
        if (price !== undefined) {
          const priceString = price.toString()
          vehicleValidation.number(priceString, res, 9, 'Preço')
          data.price = price
        }
        if (steering !== undefined) {
          vehicleValidation.string(steering, res, 'Direção')
          data.steering = steering
        }
        if (transmission !== undefined) {
          vehicleValidation.string(transmission, res, 'Transmissão')
          data.transmission = transmission
        }
        if (doors !== undefined) {
          const doorString = doors.toString()
          vehicleValidation.number(doorString, res, 1, 'Porta')
          data.doors = doors
        }
        if (fuel !== undefined) {
          vehicleValidation.string(fuel, res, 'Combústivel')
          data.fuel = fuel
        }
        if (description !== undefined) {
          vehicleValidation.string(description, res, 'Combústivel')
          data.description = description
        }

        if (res.utilized === false) {
          await Vehicle.update(data, id)

          if (additionals.length > 0) {
            await Vehicle.deleteAdd(id)

            for (const add of additionals) {
              const additional = await Vehicle.findAdditionalByName(add)

              const addData = {
                vehicle_id: id,
                additional_id: additional[0].id
              }

              await Vehicle.addAdditional(addData)
            }
          }
          res.statusCode = 200
          res.json({ msg: 'Anúncio do Veículo editado com sucesso.' })
        }
      } else {
        res.statusCode = 406
        res.json({ msg: 'Não há veículos cadastrados com esse id' })
      }
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao editar o anúncio do Veículo: ' + err })
    }
  }

  async delete (req, res) {
    try {
      const { id } = req.params
      const vehicle = await Vehicle.findById(id)

      if (vehicle.length > 0) {
        await Vehicle.delete(id)
        await Vehicle.deleteAdd(id)

        res.statusCode = 200
        res.json({ msg: 'Anúncio do Veículo deletado com sucesso.' })
      } else {
        res.statusCode = 406
        res.json({ msg: 'Não há veículos cadastrados com esse id' })
      }
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro ao deletar o anúncio do Veículo: ' + err })
    }
  }

  async findAllCars (req, res) {
    try {
      const vehicles = await Vehicle.findAllCars()

      if (vehicles.length > 0) {
        res.statusCode = 200
        res.json({ vehicles })
      } else {
        res.statusCode = 404
        res.json({ msg: 'Não há carros cadastrados ainda' })
      }
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro: ' + err })
    }
  }

  async findAllMotorcycles (req, res) {
    try {
      const vehicles = await Vehicle.findAllMotorcycles()

      if (vehicles.length > 0) {
        res.statusCode = 200
        res.json({ vehicles })
      } else {
        res.statusCode = 404
        res.json({ msg: 'Não há motos cadastradas ainda' })
      }
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro: ' + err })
    }
  }

  async findWithCategories (req, res) {
    try {
      const { model, brand, vehicleType, conservationState, steering, transmission, doors, fuel, minPrice = 0, maxPrice = 999999999, minYear = 0, maxYear = 9999, additionals } = req.body
      res.utilized = false
      const categories = {}
      const price = {}
      const year = {}
      const additionalCondition = []

      if (model !== undefined) {
        vehicleValidation.string(model, res, 'Modelo')
        categories.model = model
      }
      if (brand !== undefined) {
        vehicleValidation.string(brand, res, 'Marca')
        categories.brand = brand
      }
      if (vehicleType !== undefined) {
        vehicleValidation.string(vehicleType, res, 'Tipo de veículo')
        categories.vehicleType = vehicleType
      }
      if (conservationState !== undefined) {
        vehicleValidation.string(conservationState, res, 'Estado de conservação')
        categories.conservationState = conservationState
      }
      if (steering !== undefined) {
        vehicleValidation.string(steering, res, 'Direção')
        categories.steering = steering
      }
      if (transmission !== undefined) {
        vehicleValidation.string(transmission, res, 'Transmissão')
        categories.transmission = transmission
      }
      if (doors !== undefined) {
        const doorString = doors.toString()
        vehicleValidation.number(doorString, res, 1, 'Porta')
        categories.doors = doors
      }
      if (fuel !== undefined) {
        vehicleValidation.string(fuel, res, 'Combústivel')
        categories.fuel = fuel
      }
      if (minPrice !== undefined) {
        const minPriceString = minPrice.toString()
        vehicleValidation.number(minPriceString, res, 9, ' Preço mínimo')
        price.minPrice = minPrice
      }
      if (maxPrice !== undefined) {
        const maxPriceString = maxPrice.toString()
        vehicleValidation.number(maxPriceString, res, 9, 'Preço máximo')
        price.maxPrice = maxPrice
      }
      if (minYear !== undefined) {
        const minYearString = minYear.toString()
        vehicleValidation.number(minYearString, res, 4, 'Ano mínimo')
        year.minYear = minYear
      }
      if (maxYear !== undefined) {
        const maxYearString = maxYear.toString()
        vehicleValidation.number(maxYearString, res, 4, 'Ano máximo')
        year.maxYear = maxYear
      }

      if (res.utilized === false) {
        for (const add of additionals) {
          const additional = await Vehicle.findAdditionalByName(add)
          additionalCondition.push(additional[0].id)
        }

        const vehicles = await Vehicle.findWithCategories(categories, price, year, additionalCondition)

        if (vehicles.length > 0) {
          res.statusCode = 200
          res.json({ vehicles })
        } else {
          res.statusCode = 404
          res.json({ msg: 'Nenhum veículo encontrado' })
        }
      }
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro: ' + err })
    }
  }

  async createImage (req, res) {
    try {
      const { id } = req.params

      res.statusCode = 200
      res.json({ image: req.file, id })
    } catch (err) {
      res.statusCode = 500
      res.json({ msg: 'Ocorreu um erro: ' + err })
    }
  }
}

module.exports = new VehicleController()
