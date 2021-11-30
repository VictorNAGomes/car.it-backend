const express = require('express')
const UserController = require('./controllers/UserController')
const VehicleController = require('./controllers/VehicleController')
const LoginAuth = require('./middlewares/LoginAuth')
const multerConfig = require('./config/multer')
const multer = require('multer')

const router = express.Router()

router.get('/', (req, res) => res.send('Server is running'))

router.get('/users', UserController.findAll)
router.get('/users/address', UserController.findAllWithAddress)
router.get('/user/:id', UserController.findById)
router.get('/users/rating', UserController.findAllOrderByRating)
router.get('/user/:id/vehicles', UserController.findByIdWithVehicles)
router.get('/user/:id/favorites', LoginAuth, UserController.findFavorites)
router.get('/user/:id/image', UserController.getImage)
router.patch('/user/:id/rating', UserController.updateRating)
router.put('/user/:id', LoginAuth, UserController.update)
router.put('/user/:id/image', multer(multerConfig).single('file'), UserController.updateImage)
router.delete('/user/:id', LoginAuth, UserController.delete)
router.delete('/user/:id/image', UserController.deleteImage)
router.post('/user', UserController.create)
router.post('/user/:id/image', multer(multerConfig).single('file'), UserController.createImage)
router.post('/user/:id/address', LoginAuth, UserController.createAddress)
router.post('/user/login', UserController.login)
router.post('/user/recoverPassword', UserController.recoverPassword)
router.post('/user/changePassword', UserController.changePassword)
router.post('/user/:id/emailToVerify', LoginAuth, UserController.sendEmailToVerify)
router.post('/user/:id/verifyEmail', LoginAuth, UserController.verifyEmail)
router.post('/user/:id/setOrUnsetFavorite', LoginAuth, UserController.setOrUnsetFavorite)

router.post('/vehicle', LoginAuth, VehicleController.create)
router.post('/vehicle/:id/image', multer(multerConfig).single('file'), VehicleController.createImage)
router.put('/vehicle/:id', LoginAuth, VehicleController.update)
router.delete('/vehicle/:id', LoginAuth, VehicleController.delete)
router.delete('/vehicle/:vehicleId/image/:imageId', VehicleController.deleteImage)
router.get('/vehicles', VehicleController.findAll)
router.get('/vehicle/:id/images', VehicleController.getImages)
router.get('/vehicle/:id', VehicleController.findById)
router.get('/vehicles/cars', VehicleController.findAllCars)
router.get('/vehicles/motorcycles', VehicleController.findAllMotorcycles)
router.get('/vehicles/categories', VehicleController.findWithCategories)

module.exports = router
