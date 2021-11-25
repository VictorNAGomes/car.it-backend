const express = require('express')
const router = require('./routes')
const app = express()
const cors = require('cors')

require('dotenv').config()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(
  cors({
    credentials: false,
    origin: '*'
  })
)

app.use(router)

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log('Server is running on http://localhost:' + port)
})
