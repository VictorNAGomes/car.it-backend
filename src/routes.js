const express = require('express')
const UserController = require('./controllers/UserController')
const CarController = require('./controllers/CarController')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('aaa')
})
router.post('/user', UserController.create)

router.post('/car', CarController.create)

module.exports = router
