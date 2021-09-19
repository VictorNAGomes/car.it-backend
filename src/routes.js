const express = require('express')
const UserController = require('./controllers/UserController')
const VehicleController = require('./controllers/VehicleController')
// const LoginAuth = require('./middlewares/LoginAuth')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('aaa')
})

router.get('/users', UserController.findAll)
router.get('/user/:id', UserController.findById)
router.get('/users/rating', UserController.findAllOrderByRating)
router.get('/user/:id/vehicles', UserController.findByIdWithVehicles)
router.patch('/user/:id/rating', UserController.updateRating)
router.put('/user/:id', UserController.update)
router.delete('/user/:id', UserController.delete)
router.post('/user', UserController.create)
router.post('/login', UserController.login)
router.post('/recoverPassword', UserController.recoverPassword)
router.post('/changePassword', UserController.changePassword)
router.post('/user/emailToVerify', UserController.sendEmailToVerify)
// router.post('/user/verifyEmail', UserController.verifyEmail)

router.post('/vehicle', VehicleController.create)
router.get('/vehicles', VehicleController.findAll)
router.get('/vehicle/:id', VehicleController.findById)
router.put('/vehicle/:id', VehicleController.update)
router.delete('/vehicle/:id', VehicleController.delete)

module.exports = router
