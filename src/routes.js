const express = require('express')
const UserController = require('./controllers/UserController')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('aaa')
})
router.post('/user', UserController.create)

module.exports = router
