const productsRouter = require('express').Router()

const products = [
  {
    id: 1,
    name: 'banana',
    price: 1,
  },
  {
    id: 2,
    name: 'apple',
    price: 4,
  },
  {
    id: 3,
    name: 'orange',
    price: 6,
  },
]

productsRouter.get('/', (request, response) => {
  response.json(products)
})

module.exports = productsRouter
