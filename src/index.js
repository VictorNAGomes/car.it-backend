const express = require('express')
const router = require('./routes')
const app = express()

require('dotenv').config()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(router)

const port = process.env.SERVER_PORT || 8080

app.listen(port, () => {
  console.log('Server is running on http://localhost:' + process.env.SERVER_PORT)
})
