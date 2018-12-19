const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./utils/config')

mongoose
  .connect(config.mongoUrl)
  .then(() => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch((error) => {
    console.log(error)
  })

const app = express()
const productsRouter = require('./controllers/products')

app.use(bodyParser.json())
app.use('/api/products', productsRouter)

app.get('/', (request, response) => {
  response.send('<h1>ecommerce-backend</h1>')
})

const PORT = config.port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
