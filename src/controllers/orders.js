const orderRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Order = require('../models/order')

orderRouter.get('/', async (request, response) => {
  try {
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)

    // if (!decodedToken.admin) {
    //   return response.status(401).json({ error: 'no admin rights' })
    // }

    const orders = await Order.find({})
      .populate('products')
      .populate('user', { name: 1, username: 1 })
    return response.json(orders.map(order => order.toJSON()))
  } catch (exception) {
    console.log(exception)
    return response.status(400).json(exception)
  }
})

orderRouter.post('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const { body } = request
    console.log(body)

    const order = new Order({
      user: decodedToken.id,
      products: body.products,
      date: Date(),
      totalPrice: body.totalPrice,
    })

    console.log('Order', order)
    const savedOrder = await order.save()

    return response.status(201).json(savedOrder)
  } catch (exception) {
    console.log(exception)
    return response.status(400).json(exception)
  }
})

module.exports = orderRouter
