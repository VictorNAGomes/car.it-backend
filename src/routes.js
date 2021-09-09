const express = require('express')
const UserController = require('./controllers/UserController')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('aaa')
})
router.post('/user', UserController.create)
router.get('/users', UserController.findAll)
router.get('/user/:id', UserController.findById)
router.put('/user/:id', UserController.update)
router.delete('/user/:id', UserController.delete)

module.exports = router
