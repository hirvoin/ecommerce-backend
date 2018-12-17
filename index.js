const express = require('express')

const app = express()
const productsRouter = require('./controllers/products')

app.get('/', (request, response) => {
  response.send('<h1>ecommerce-backend</h1>')
})

app.use('/api/products', productsRouter)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
