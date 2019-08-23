const orderRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Order = require('../models/order')
const User = require('../models/user')

orderRouter.get('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    if (!user.admin) {
      return response.status(403).json({ error: 'no admin rights' })
    }

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
    const user = await User.findById(decodedToken.id)

    const { body } = request

    if (body.products.length < 1 || !body.deliveryAddress) {
      return response.status(400).json({ error: 'order details missing' })
    }

    const order = new Order({
      user: user.id,
      products: body.products,
      date: Date(),
      totalPrice: body.totalPrice,
      deliveryAddress: body.deliveryAddress,
    })

    const savedOrder = await order.save()
    console.log('Order saved', order)
    await User.findByIdAndUpdate(user._id, {
      orders: [...user.orders, savedOrder.id],
    })

    return response.status(201).json(savedOrder)
  } catch (exception) {
    console.log(exception)
    return response.status(400).json(exception)
  }
})

module.exports = orderRouter
